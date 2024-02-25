export class ReservationsController {
    constructor(reservationsService){
        this.reservationsService = reservationsService
    }


    reserveByUser = async(req, res, next) => {
        const { userId } = req.user
        const { sitterId, petIds, startDay, lastDay } = req.body;
        try {
            const reservation = await this.reservationsService.reserveByUser(userId, sitterId, petIds, startDay, lastDay);
            res.status(201).json(reservation);
        } catch(error) {
            res.status(400).json({ message: error.message});
        }
    }
}