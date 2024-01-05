import { IGunInstance, IGunInstanceRoot, IGunUserInstance } from "gun";
import GUN from "gun/gun";
// import "gun/lib/radix"
// import "gun/lib/radisk"
// import "gun/lib/store"
// import "gun/lib/rindexed"
import "gun/sea"
import { useState, useContext, createContext, useEffect } from "react";

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
}

const UserContext = createContext<UserContextValues | null>(null)

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState("")
    const [pfp, setPfp] = useState("")

    const db = GUN({
        peers: ['https://gun-manhattan.herokuapp.com/gun', `https://gundb-relay-mlccl.ondigitalocean.app/gun`]
    })

    const user = db.user().recall({ sessionStorage: true }) as IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

    const [displayname, setDisplayname] = useState("")

    useEffect(() => {
        db.on("auth", async () => {
            user.get("alias").on((v) => {
                setUsername(v)
            })

            user.get("displayname").on((v) => setDisplayname(v))

            user.get("profilepic").on(async (v) => {
                console.log(v)

                if(!v) return setPfp(`https://api.dicebear.com/7.x/notionists/svg/seed=${username}`)

                const blob = await (await fetch(v)).blob()

                const url = URL.createObjectURL(blob)

                setPfp(url)
            })
        })
    }, [])

    function signUp(username: string, password: string) {
        return new Promise<void>((resolve, reject) => {
            // @ts-expect-error
            user.create(username, password, ({ err }) => {
                if (err) {
                    reject(err)
                } else {
                    // @ts-expect-error
                    user.auth(username, password, ({ err: error }) => {
                        if (error) {
                            alert(error)
                            reject(error)
                        } else {
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
            // @ts-expect-error
            user.auth(username, password, ({ err }) => {
                if (err) {
                    reject(err)
                } else {
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
    }

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    )
}