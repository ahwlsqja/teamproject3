export class ReservationsService {
    constructor(reservationsRepository){
        this.reservationsRepository=reservationsRepository;
    }

    reserveByuser = async (userId, sitterId, petIds, startDay, lastDay) => {
        const user = await this.usersRepository.getUserById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        const existingReservations = await reservationsRepository.findReservationsBySitterAndDate(sitterId, startDay, lastDay);
        if (existingReservations.length > 0 ) {
            throw new Error('해당날짜는 불가능합니다.');
        }

        for (const petId of petIds) {
            const existingPetReservations = await reservationsRepository.findReservationsByPetAndDate(petId, startDay, lastDay);
    
            if (existingPetReservations.length > 0) {
                throw new Error(`${petId}가 예약 중입니다.`);
            }
        }

        const reservation = await reservationsRepository.createReservation(userId, sitterId, petIds, startDay, lastDay);
    
        return reservation;
    }
}