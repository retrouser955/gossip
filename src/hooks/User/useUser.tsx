import { FetchUserData, useMainUser } from "../MainUser/useMainUser";

export function useUser() {
    const { db } = useMainUser()!

    return function(alias: string) {
        return new Promise<FetchUserData>((resolve, reject) => {
            db.get(`~@${alias}`).once((data: any) => {
                if(!data) reject()
        
                const user = db.user(Object.keys(data)[1].replace("~", ""))
                // @ts-ignore
                resolve(user)
            })
        })
    }
}