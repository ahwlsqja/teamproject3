import { Prisma } from '@prisma/client';
export class ReservationsRepository {
    constructor(prisma){
        this.prisma = prisma;
    }
    




    
    // 시터 예약 검사
    findReservationsBySitterAndDate = async (sitterId, startDay, lastDay) => {
        return await this.prisma.reservations.findMany({
            where: {
                sitterId: sitterId,
                status: 'ACCEPTED',
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

    // 펫 예약 검사
    findReservationsByPetAndDate = async (petId, startDay, lastDay) => {
        return await this.prisma.reservations.findMany({
            where: {
                reservationPet: {
                    some: {
                        petId: petId,
                    },
                },
                status: 'ACCEPTED',
                startDay: {
                    lt: lastDay,
                },
                lastDay: {
                    gt: startDay,
                },
            },
        });
    }

    // 예약 만들기(유저)
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

    // 예약 조회
    getReservationById = async (reservationId) => {
        return await this.prisma.reservations.findUnique({
            where: {
                Id: reservationId
            }
        })
    }

    // 예약 목록 조회
    findListofupdateReservation = async (userId) => {
        return await this.prisma.reservations.findMany({
            where: {
                userId: +userId
            }
        })
    }

    // 예약 삭제
    deleteReservation = async (reservationId) => {
        return await this.prisma.reservations.delete({
            where: {
                Id: reservationId
            }
        })
    }

    // 예약 수정 
    updateReservation = async (reservationId, petIds, startDay, lastDay) => {
        const updatedReservation = await this.prisma.reservations.update({
            where: {
                Id: reservationId
            },
            data: {
                startDay: startDay,
                lastDay : lastDay,
            },
        });

        await this.prisma.reservationPet.deleteMany({
            where: {
                reservationId: reservationId,
            }
        });

        for(const petId of petIds){
            await this.prisma.reservationPet.create({
                data: {
                    petId: petId,
                    reservationId: reservationId,
                }
            });
        }

        return updatedReservation;
    }

    // 펫들의 예약정보 목록 들고 오기
    findReservationsByUser = async (userId) => {
        const pets = await this.prisma.pets.findMany({
            // 해당 유저에 대한 펫들 모두 가져와서 배열로 만들어서 pets에 저장
            where: { userId : userId },
        })

        // 정보 담을 배열 선언
        let petListofReservation = [];
        for (const pet of pets){
            // pets 배열 순회 돌면서 각 요소 pet에대한 reservations 가져옴
            const petReservations = await this.prisma.reservationPet.findMany({
                where : { petId : pet.petId },
                include: { reservations: true},
            });
            
            // petReservations 배열 순회 돌면서 각요소 reservation에 대한 reservations 정보를 모두 담어서 각각 배열에 push
            for (const reservation of petReservations){
                petListofReservation.push(reservation.reservations)
            }
        }

    }

    // 시터의 예약 정보 목록 들고 오기
    findReservationsBySitter = async(sitterId) => {
        // sitterId에 해당하는 예약 정보에서
        const reservationsofSitter = await this.prisma.reservations.findMany({
            where: { sitterId: sitterId },
            // reservationPet에서 Pets정보 들고오는데 또 거기에서 user들고오는데 
            include: {
                reservationPet: {
                    include: {
                        pets: {
                            include: { 
                                user: {
                                    select: { userId : true,
                                              name: true}
                                } 
                            }
                        }
                    }
                }
            }
        });

        return reservationsofSitter
    }

    // 시터의 예약 수락 코드
    ReservationAcceptBySitter = async(reservationId) => {
        const updatedReservation = await this.prisma.reservations.update({
            where: {
                Id: reservationId
            },
            data: {
                status: "ACCEPTED"
            },
        }); 

        return updatedReservation
    }


}