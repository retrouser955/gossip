import { IGunUserInstance, IGunInstanceRoot, IGunInstance } from "gun";
import { FetchUserData } from "../useMainUser";

export class Friends {
    epub: string;
    db: IGunInstance<any>

    constructor(db: IGunInstance<any>, epub?: string, user?: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>) {
        this.db = db
        if(typeof epub == "string") this.epub = epub
        else if(!user?.is) throw new Error("Unable to get user as he/she is not logged in")
        else this.epub = user.is.epub
    }

    getAll() {
        return new Promise<{ [key: string]: FetchUserData }>(async (resolve) => {
            this.db.get(`${this.epub}-friends`).once((v) => resolve(v))
        })
    }

    addFriend(friend: FetchUserData) {
        return new Promise(async (resolve) => {
            this.db.get(`${this.epub}-friends`).once(async (v: { [key: string ]: FetchUserData } | undefined) => {
                if(!v) {
                    await new Promise((res) => {
                        let obj: { [key: string]: FetchUserData } = {}
                        
                        obj[friend.epub] = friend

                        this.db.get(`${this.epub}-friends`).put(obj, () => {
                            res(undefined)
                        })
                    })

                    resolve(undefined)
                }

                console.log("Logging value", v)

                await new Promise((res) => this.db.get(`${this.epub}-friends`).put({ ...v, friend }, () => res))

                resolve(undefined)
            })
        })
    }

    removeFriend(friend: FetchUserData) {
        return new Promise(async (resolve, reject) => {
            const users: { [key: string]: FetchUserData } | undefined = await new Promise((res) => this.db.get(`${this.epub}-friends`).once((data) => res(data)))

            if(!users) return reject("unable to locate friend to remove.")

            const user = users[friend.pub]

            if(!user) return reject("Unable to locate friend to remove")

            delete users[friend.pub]

            this.db.get(`${this.epub}-friends`).put(users, () => resolve(undefined))
        })
    }
}