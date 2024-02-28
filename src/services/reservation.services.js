export class ReservationsService {
    constructor(reservationsRepository ,usersRepository){
        this.reservationsRepository = reservationsRepository;
        this.usersRepository = usersRepository
    }

    // 예약 생성
    // body값 넣을 때 startDay: "2023-01-01T00:00:00.000Z" 이런 자료형으로 넣어야됨
    // petIds : [1, 2, 4, 5]은 이렇게
    reserveByuser = async (userId, sitterId, petIds, startDay, lastDay) => {
        const user = await this.usersRepository.getUserById(userId);
        // 예약하려는 유저가 없습니다.
        if (!user) {
            throw new Error('해당 유저가 없습니다.');
        }
        // 시터가 예약 생성을 하려는 날짜에 예약이 잡혀있다면 해당 날짜는 불가능 합니다. 
        const existingReservations = await this.reservationsRepository.findReservationsBySitterAndDate(sitterId, startDay, lastDay);

        if (existingReservations.length > 0 ) {
            throw new Error('해당날짜는 불가능합니다.');
        }
        
        // 하나의 펫이라도 예약 생성을 하려는 날짜에 예약이 잡혀있다면 해당 날짜는 불가능 합니다.
        for (const petId of petIds) {
            const existingPetReservations = await this.reservationsRepository.findReservationsByPetAndDate(petId, startDay, lastDay);
    
            if (existingPetReservations.length > 0) {
                throw new Error(`${petId}가 예약 중입니다.`);
            }
        }

        // 예약 생성
        const reservation = await this.reservationsRepository.createReservation(userId, sitterId, petIds, startDay, lastDay);
    
        return reservation;
    }

    // 예약 취소
    cancelReservation = async (reservationId, userId) => {
        const reservation = await this.reservationsRepository.getReservationById(reservationId);
        // 현재 날짜
        const today = new Date();

        // 예약이 없으면 
        if(!reservation){
            throw new Error("해당 예약은 존재하지 않습니다.")
        }

        // 예약된 유저정보와 예약 취소하려는 유저정보가 다르면 
        if(reservation.userId !== userId){
            throw new Error("예약하지 않았습니다.")
        }

        // 예약 상태가 ACCEPTED면 이미 수락된 상태이기 때문에 일방적인 예약취소를 할 수 없습니다 하지만 예약 포기를 하시려면 과금이 들 수 있습니다..
        if(reservation.status === 'ACCEPTED'){
            throw new Error("이미 시터가 수락한 예약입니다. 수정할 수 없습니다.")
        }

        // 남은달이 7일 미만이면 예약 취소를 할 수 없습니다.
        const leftDays = (new Date(reservation.startDay) - new Date(today)) / (1000 * 60 * 60 * 24);
        if(leftDays < 7) {
            throw new Error('일주일 미만으로는 예약 취소가 불가능 합니다.')
        }

        await this.reservationsRepository.deleteReservation(reservationId);
    }
    

    // 예약 수정
    updateReservation = async (reservationId, userId, petIds, startDay, lastDay) => {
        // 예약 Id 찾아서 넣음
        const reservation = await this.reservationsRepository.getReservationById(reservationId);
        // 오늘 날짜 변수에 넣음
        const today = new Date();

        // 만약 예약이 없으면
        if(!reservation){
            throw new Error("해당 예약은 존재하지 않습니다.");
        }
        // 예약된 유저정보와 예약 취소하려는 유저정보가 다르면 
        if(reservation.userId !== userId){
            throw new Error("예약하지 않았습니다.")
        }

        // 만약 예약 상태가 ACCEPTED 라면 <-->(동치) 시터가 예약을 수락한다면 예약 수정 불가
        if(reservation.status === 'ACCEPTED'){
            throw new Error("이미 시터가 수락한 예약입니다. 수정할 수 없습니다.")
        }

        // 남은 날이 7일 미만이면 수정 안된다.
        const leftDays = (new Date(reservation.startDay) - new Date(today)) / (1000 * 60 * 60 * 24);
        if(leftDays < 7) {
            throw new Error('일주일 미만으로는 예약 취소가 불가능 합니다.')
        }

        // 수정하려고 하는 날짜에 시터가 예약 잡혀있으면 안된다.
        const existingReservationsSitter = await this.reservationsRepository.findReservationsBySitterAndDate(reservation.sitterId, startDay, lastDay);
        if(existingReservationsSitter.length > 0 ){
            throw new Error("해당 시터는 수정하려는 날짜에 이미 예약이 존재합니다. 다른 날짜를 선택해주세요.");
        }

        // 수정하려고 하는 날짜에 하나의 펫이라도 예약이 잡혀있다면 안된다.
        for(const petId of petIds){
            const existingPetReservations = await this.reservationsRepository.findReservationsByPetAndDate(petId, startDay, lastDay);
            
            if(existingPetReservations.length > 0){
                throw new Error(`펫 ${petId}는 수정하려는 날짜에 예약이 있습니다. 다른 날짜를 선택해주세요.`)
            }
        }

        // 이 모든 유효성을 통과하면 수정
        const updatedReservation = await this.reservationsRepository.updateReservation(reservationId, petIds, startDay, lastDay);
        return updatedReservation;
    }

    // 예약 목록 조회(유저 입장 펫들의 예약 목록 들고옴)
    findReservationsByUser = async (userId) => {
        const isExistUser = await this.usersRepository.findUserByUserId(userId)

        if(!isExistUser){
            throw new Error("해당 유저가 없습니다.");
        }

        const foundReservationsByUser = await this.reservationsRepository.findReservationsByUser(userId);
        return foundReservationsByUser
    }



    // 예약 목록 조회(시터 입장에서)
    findReservationsBySitter = async(sitterId) => {
        // 유효성 검사 필요함 sitter 코드 들어오면 할게여
        const findReservationsBySitter = await this.reservationsRepository.findReservationsBySitter(sitterId)
        return findReservationsBySitter
    }

    // 시터의 예약 수락 코드
    ReservationAcceptBySitter = async(sitterId, reservationId) => {
        // 유효성 검사 필요함 sitter 코드 들어오면 할게여
        const reservation = await this.reservationsRepository.getReservationById(reservationId);
        if(!reservation) {
            throw new Error("예약이 존재하지 않습니다.");
        }
        // 예약에 기록된 시터와 현재 시터가 일치하지 않을 경우 에러 처리

        if(reservation.sitterId !== sitterId){
            throw new Error("시터 정보가 일치하지 않습니다.");
        }
        // 겹치는 날짜중에 ACCEPTED면 상태면 안되고 그외는 할 수 있게
        const existingReservations = await this.reservationsRepository.findReservationsBySitterAndDate(sitterId, reservation.startDay, reservation.lastDay)
        if(existingReservations[0]){
          throw new Error("이미 수락된 상태입니다. 예약할수 없습니다.")
        }

        if(reservation.status !== "ACCEPTED"){
            const updatedReservation = await this.reservationsRepository.ReservationAcceptBySitter(reservationId);
            return updatedReservation
        } else{
            throw new Error("이미 수락하셨습니다.");
        }

    }

    // 시터의 예약 거절 코드
    ReservationRejectBySitter = async(sitterId, reservationId) => {
        // 유효성 검사 필요함 sitter 코드 들어오면 할게여
        const reservation = await this.reservationsRepository.getReservationById(reservationId);
        if(!reservation) {
            throw new Error("예약이 존재하지 않습니다.");
        } 
        // 예약에 기록된 시터와 현재 시터가 일치하지 않을 경우 에러 처리

        if(reservation.sitterId !== sitterId){
            throw new Error("시터 정보가 일치하지 않습니다.")
        }

        if(reservation.status === "REJECTED"){
            throw new Error("이미 거절된 예약 입니다.")
        }
        const updatedReservation = await this.reservationsRepository.ReservationRejectBySitter(reservationId);
        return updatedReservation
    }
}