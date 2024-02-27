export class SittersController {
    constructor(sittersService){
        this.sittersService = sittersService;
    }



    getSittersBypetType = async (req, res, next) => {
        const { ablePetType } = req.query;

        try{ 
           if(!ablePetType){
            return res.status(400).json({ message : "종을 선택 해주세요."});
           }

           if(!['dog', 'cat', 'others'].includes(ablePetType.toLowerCase())){
            return res.status(400).json({ message: "종선택이 바르지 않습니다"})
           }

           const filleredSittersByPetType = await this.sittersService.getSitterBypetType(ablePetType)
           return res.status(200).json({ data:filleredSittersByPetType })
        } catch(err){
            next(err)
        }
    }

    getSittersByAddress = async ( req, res, next) => {
        const { adrress_Sitters } = req.query;
        try{ 
            if(!adrress_Sitters){
             return res.status(400).json({ message : "주소를 선택 해주세요."});
            }
 
            if(!['seoul',
                'gyeonggi',
                'gangwon',
                'chungbuk',
                'chungnam',
                'jeonbuk',
                'jeonnam',
                'gyeongbuk',
                'gyeongnam',
                'jeju'].includes(adrress_Sitters.toLowerCase())){
             return res.status(400).json({ message: "주소 선택이 바르지 않습니다"})
            }
 
            const filleredSittersByAddress = await this.sittersService.getSittersByAddress(adrress_Sitters)
            return res.status(200).json({ data:filleredSittersByAddress })
         } catch(err){
             next(err)
         }
    }

    

}