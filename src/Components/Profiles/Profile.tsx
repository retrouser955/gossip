import { UserContextValues, useMainUser } from "../../hooks/MainUser/useMainUser"
import ProfileCard from "./ProfileCard"
import ProfileEdit from "./ProfileEdit"

export default function Profile() {
    const { logout, username, displayname, pfp, deleteAccount, bio } = useMainUser() as UserContextValues

    return (
        <>
            {
                username && <div className="mt-[10vh] justify-between flex p-10 w-screen h-[90vh] bg-emerald-950">
                    <ProfileCard username={username} displayname={displayname} logout={logout} deleteAccount={deleteAccount} pfp={pfp} showLogout bio={bio || "This user has not set a bio"} />
                    <div className="h-full w-[60vw] bg-emerald-900 rounded-xl">
                        <ProfileEdit />
                    </div>
                </div>
            }
        </>
    )
}
