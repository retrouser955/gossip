/**
 * TODO: IMPLEMENT A PULL OUT SYSTEM FOR FRIENDS
 */
import Swal from "sweetalert2"
import { useMainUser } from "../../hooks/MainUser/useMainUser"
import FriendsContainer from "./Containers/Friends/FriendsContainer"
import { Friends } from "../../hooks/MainUser/helpers/Friends"

export default function ChatComponent() {
    const { friends, db, user, getUser, username, displayname, pfp, bio, epub, pub } = useMainUser()!

    return (
        <div className="w-screen h-[90vh] bg-emerald-950 mt-[10vh] flex">
            {/** FRIENDS */}
            <div className="w-[20%] pt-4 scroll-auto bg-emerald-900 h-full">
                <div className="w-[95%] mx-auto my-1 items-center rounded-md h-10">
                    <button className="border-2 w-full h-full rounded-md text-white bg-emerald-800 border-green-600" onClick={async () => {
                        const { value: formValues } = await Swal.fire({
                            title: "Delete your account?",
                            html: `
                                <h4 class="text-gray-400">Friend's <strong>alias</strong></h4>
                                <input id="userinput" class="swal2-input">
                            `,
                            focusConfirm: false,
                            preConfirm: () => {
                                return (document.getElementById("userinput") as HTMLInputElement).value
                            }
                        });
                        if (formValues) {
                            const alias = formValues as string
                            const them = await getUser(alias)

                            console.log(them)

                            if(!them) return Swal.fire("Unable to locate user", `The user with the alias ${alias} was not found`, "error")

                            const theirFriends = new Friends(db, them.epub)

                            if(!epub || !pub) return Swal.fire("Pub not set", "Pub not set error", "error")
                            
                            const handShake = [
                                theirFriends.addFriend({
                                    bio,
                                    profilepic: pfp,
                                    alias: username,
                                    displayname,
                                    epub,
                                    pub
                                }),
                                new Friends(db, undefined, user).addFriend(them)
                            ]

                            console.log('Shaking hands ...')

                            await Promise.all(handShake)

                            console.log('Hand shake complete')

                            Swal.fire("Added", `Added ${them.displayname} (${them.alias}) as friends`)
                        }
                    }}>Add Friend</button>
                </div>
                {
                    Object.values(friends).map((val) => {
                        return <FriendsContainer pfp={val.profilepic ?? `https://api.dicebear.com/7.x/notionists/svg/seed=${val.alias}`} name={val.displayname} epub={val.epub} />
                    })
                }
            </div>
        </div>
    )
}
