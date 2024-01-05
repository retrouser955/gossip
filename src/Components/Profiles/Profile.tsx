import { UserContextValues, useUser } from "../../hooks/useUser"
import ProfileEdit from "./ProfileEdit"

export default function Profile() {
    const { logout, username, displayname, pfp } = useUser() as UserContextValues

    return (
        <>
            {
                username && <div className="mt-[10vh] justify-between flex p-10 w-[screen] h-[90vh] bg-emerald-950">
                    <div className="w-96 overflow-hidden rounded-xl bg-gradient-to-b from-emerald-800 to-green-800 hover:shadow-2xl transition-all">
                        <div className="w-full pt-10 h-28 bg-gray-700">
                            <div className="w-32 ml-4 h-32 overflow-hidden bg-gray-600 rounded-full">
                                <img src={pfp || `https://api.dicebear.com/7.x/notionists/svg/seed=${username}`} className="" alt={`${username}'s profile picture`} />
                            </div>
                            <div className="ml-4 text-2xl font-semibold text-white">{displayname ?? username}</div>
                            <div className="ml-4 font-semibold text-gray-400">{username}</div>
                            <div className="w-full mt-5 px-4 text-gray-300 text-sm">
                                <p className="text-lg mb-2 font-bold text-gray-100">BIO</p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et nibh eget lorem ullamcorper dignissim. Praesent et imperdiet nunc. Etiam at blandit nunc. Donec vulputate, risus vitae dictum eleifend, felis nibh aliquet diam, quis sollicitudin libero ligula vitae tellus. Praesent vel interdum arcu. Morbi justo mauris, finibus in lectus at.
                            </div>
                            <button className="ml-3 mt-5 hover:bg-green-900 transition-all w-20 h-10 text-lg text-gray-300 border-2 rounded-lg border-red-500" onClick={() => {
                                logout()
                                window.location.replace(window.location.origin)
                            }}>Logout</button>
                        </div>
                    </div>
                    <div className="h-full w-[60vw] bg-emerald-900 rounded-xl">
                        <ProfileEdit />
                    </div>
                </div>
            }
        </>
    )
}
