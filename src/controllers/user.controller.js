export class Userscontroller{
    constructor(usersService){
        this.usersService = usersService;
    }
}




getUser = async (req, res, next) => {
    try{
        const { userId } = req.user;
        const user = await this.usersService.getUser(userId)
        return res.status(200).json({ data : user});

    }catch(err){
        next(err)
    }
}