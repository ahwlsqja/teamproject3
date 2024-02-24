import { Prisma } from '@prisma/client';
export class ReservationsRepository {
    constructor(prisma){
        this.prisma = prisma;
    }

    findReservationsBySitterAndDate = async (sitterId, startDay, lastDay) => {
        return await this.prisma.reservations.findMany({
            where: {
                sitterId: sitterId,
                startDay: {
                    lt: lastDay, // 여기서 lt는 Less Than 의 약자로 이 필드의 값이 지정한 값보다 작거나 같은 데이터를 말함
                },
                lastDay: {
                    gt: startDay, // 여기서 gte는 Greater Than or Equal To 의 약자로, 이 필드의 값이 지정한 값보다 크거나 같은 데이터를 말하낟.
                },
                // 즉 시작일이 예약종료일보다 작거나 같고 과 종료일이 예약시작일보다 크거나 같은 데이터를 찾는것이다.
            },
        });
    }

    findReservationsByPetAndDate = async (petId, startDay, lastDay) => {
        return await this.prisma.reservations.findMany({
            where: {
                reservationPet: {
                    some: {
                        petId: petId,
                    },
                },
                startDay: {
                    lt: lastDay,
                },
                lastDay: {
                    gt: startDay,
                },
            },
        });
    }

    createReservation = async (userId, sitterId, petIds, startDay, lastDay) => {
        const reservation = await this.prisma.reservations.create({
            data: {
                sitterId: sitterId, // 예약을 받을 펫시터의 아이디
                startDay: startDay, // 예약 시작 날짜
                lastDay: lastDay, // 예약 종료 날짜
                status: 'APPLYING', // 초기 상태: 신청 중
            },
        });

        for (const petId of petIds){
            await this.prisma.reservationPet.create({
                data: {
                    petId: petId, // 예약한 펫의 아이디
                    Id: reservation.Id, // 생성된 예약의 아이디
                },
            });
        }

        return reservation;
    }
}