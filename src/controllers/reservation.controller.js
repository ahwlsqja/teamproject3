export class ReservationsController {
    constructor(reservationsService){
        this.reservationsService = reservationsService
    }

    // body값 넣을 때 startDay: "2023-01-01T00:00:00.000Z" 이런 자료형으로 넣어야됨
    // petIds : [1, 2, 4, 5]은 이렇게
    // 예약 생성
    reserveByUser = async(req, res, next) => {
        const { userId } = req.user
        const { sitterId, petIds, startDay, lastDay } = req.body;
        try {
            const reservation = await this.reservationsService.reserveByuser(userId, sitterId, petIds, startDay, lastDay);
            return res.status(201).json(reservation);
        } catch(error) {
            next(error)
        }
    }
    // 예약 취소
    cancelReservation = async(req, res, next) => {
        const { userId } = req.user;
        const { reservationId } = req.params;
        try{
            if(!reservationId){
                return res.status(400).json({ message: "취소하려는 예약 번호를 입력해주세요"})
            }
            await this.reservationsService.cancelReservation(reservationId, userId)
            return res.status(200).json({ message: '예약이 취소되었습니다.'})
        } catch(error){
            next(error)
        }
    }
    // 예약 수정
    updateReservation = async (reservationId, userId, petIds, startDay, lastDay) => {
        const { userId } = req.user;
        const { reservationId } = req.params;
        const { petIds, startDay, lastDay } = req.body;
        try{
            if(!reservationId || !petIds || !startDay || !lastDay){
                return res.status(400).json({ message: "모든 칸을 전부 입력해 주세요."});
            }
            await this.reservationsService.updateReservation(reservationId, userId, petIds, startDay, lastDay)
            return res.status(200).json({ message: "성공적으로 수정되었습니다."})
        }catch(error){
            next(error)
        }
    }

    // 유저 펫 예약 목록 조회
    findReservationsByUser = async (userId) => {
        const { userId } = req.user;
        try{
            const reservationofUser = await this.reservationsService.findReservationsByUser(userId);
            return res.status(200).json({ data: reservationofUser })
        }catch(error){
            next(error);
        }
    }

    // 시터아이디 예약 목록 조회
    findReservationsBySitter = async (sitterId) => {
        const { sitterId } = req.sitter;
        try{
            const reservationofSitter = await this.reservationsService.findReservationsBySitter(sitterId);
            return res.status(200).json({ data: reservationofSitter })
        }catch(error)
        {
            next(error)
        }
    }
}