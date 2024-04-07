import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEAPair } from "gun";
import GUN from "gun/gun";
import "gun/lib/radix"
import "gun/lib/radisk"
import "gun/lib/store"
import "gun/lib/rindexed"
import "gun/sea"
import { useState, useContext, createContext, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { GunUtils } from "../../GunUtils/GunUtils";
import { Friends } from "./helpers/Friends";

export interface FetchUserData {
    alias: string;
    displayname: string;
    profilepic?: string;
    epub: string;
    pub: string;
    bio?: string;
}

export interface UserContextValues {
    signUp: (username: string, password: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    logout: () => void;
    deleteAccount: (username: string, password: string) => Promise<void>;
    db: IGunInstance<any>;
    user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>;
    displayname: string;
    pfp: string;
    encryptMessage: (data: string, epub: string) => Promise<string>;
    decryptMessage: (data: string, epub: string) => Promise<string>;
    getUser: (alias: string) => Promise<FetchUserData|void>;
    bio: string;
    friends: { [key: string]: FetchUserData };
    pub?: string;
    epub?: string;
}

const UserContext = createContext<UserContextValues | null>(null)

export function useMainUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState("")
    const [pfp, setPfp] = useState("")
    const [seaKeys, setSeaKeys] = useState<ISEAPair | void>(undefined)

    const db = GUN({
        peers: ['https://gun-manhattan.herokuapp.com/gun', `https://gundb-relay-mlccl.ondigitalocean.app/gun`]
    })

    const user = db.user().recall({ sessionStorage: true }) as IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

    const [displayname, setDisplayname] = useState("")

    const [bio, setBio] = useState("")

    const [friends, setFriends] = useState<UserContextValues['friends']>({})

    useEffect(() => console.log(friends), [friends])

    useEffect(() => {
        db.on("auth", async (ack) => {
            // @ts-ignore
            if (!ack?.sea) {
                Swal.fire("Error", "Unable to get SEA data from the database. Please try again", "error")
                return user.leave()
            }

            // @ts-expect-error
           setSeaKeys(ack.sea)

            user.get("alias").on((v) => {
                setUsername(v)
            })

            user.get("displayname").on((v) => setDisplayname(v))

            user.get("profilepic").on(async (v) => {
                if (!v) return setPfp(`https://api.dicebear.com/7.x/notionists/svg/seed=${username}`)

                const blob = await (await fetch(v)).blob()

                const url = URL.createObjectURL(blob)

                setPfp(url)
            })

            user.get("bio").on(async (v: string) => {
                setBio(v)
            })

            db.get(`${user.is?.epub!}-friends`).on(async (val: any) => {
                console.log(val)

                const friends = new Friends(db, undefined, user)

                const fr = await friends.getAll()
                // @ts-ignore
                const filtered = Object.keys(fr).filter((v: any) => v?.alias).reduce((res, key) => (res[key] = obj[key], res), {})

                console.log(filtered)

                setFriends(filtered)
            })
        })
    }, [])

    // function getUserByPublicKey(pub: string) {
    //     return new Promise<FetchUserData>((resolve) => {
    //         // @ts-ignore
    //         db.user(pub).once(resolve)
    //     })
    // }

    function getUser(alias: string): Promise<FetchUserData|undefined> {
        return new Promise<FetchUserData|undefined>((resolve) => {
            db.get(`~@${alias}`).once((data: any) => {
                if(!data) resolve(undefined)

                const user = db.user(Object.keys(data)[1].replace("~", ""))
                // @ts-ignore
                user.once(resolve)
            })
        })
    }

    const encryptMessage = (data: string, epub: string) => GunUtils.sea.encryptData(
        data,
        seaKeys!.epriv,
        seaKeys!.epub,
        epub
    )

    const decryptMessage = async (data: string, epub: string) => GunUtils.sea.decryptMessage(
        data,
        seaKeys!.epriv,
        seaKeys!.epub,
        epub
    ) 

    function signUp(username: string, password: string) {
        return new Promise<void>(async (resolve, reject) => {
            const doesUserExists = await new Promise((resolve) => db.get(`~@${username}`).once((data: any) => resolve(data)))

            if (doesUserExists) reject("Unable to create account as user with this alias already exists")

            // @ts-expect-error
            user.create(username, password, ({ err }) => {
                if (err) {
                    reject(err)
                } else {
                    user.auth(username, password, (ack) => {
                        // @ts-expect-error
                        if (ack?.err) {
                            // @ts-expect-error
                            alert(ack.err)
                            // @ts-expect-error
                            reject(ack.err)
                        } else {
                            // @ts-ignore
                            const pair = ack?.sea

                            console.log(pair)

                            setUsername(username)
                            user.get("displayname").put(username, () => {
                                resolve()
                            })
                        }
                    })
                }
            })
        })
    }

    function login(username: string, password: string) {
        return new Promise<void>((resolve, reject) => {
            user.auth(username, password, (ack) => {
                // @ts-expect-error
                if (ack.err) {
                    // @ts-expect-error
                    reject(ack?.err)
                } else {
                    // @ts-ignore
                    const pair = ack?.sea

                    console.log(pair)
                    setUsername(username)
                    resolve(undefined)
                }
            })
        })
    }

    function logout() {
        user.leave()
        setUsername("")
    }

    function deleteAccount(password: string) {
        return new Promise<void>((resolve, reject) => {
            user.leave()
            // @ts-expect-error
            user.delete(username, password, ({ err }) => {
                if (err) {
                    reject(err)
                } else {
                    setUsername('')
                    resolve()
                }
            })
        })
    }

    const values = {
        signUp,
        login,
        username,
        setUsername,
        logout,
        deleteAccount,
        db,
        user,
        displayname,
        pfp,
        encryptMessage,
        decryptMessage,
        getUser,
        bio,
        friends,
        epub: seaKeys!?.epub,
        pub: seaKeys!?.epriv
    }

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    )
}