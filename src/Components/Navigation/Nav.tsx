import { UserContextValues, useMainUser } from "../../hooks/MainUser/useMainUser"

export default function Nav() {
    const { displayname, pfp, username } = useMainUser() as UserContextValues
    
    return (
        <nav className="absolute flex items-center top-0 right-0 h-[10vh] bg-emerald-700 w-screen">
            <a href="/">
                <div className="text-3xl font-semibold text-white ml-3">Gossip</div>
            </a>
            {
                displayname && <a href={"/app/profile"} className="ml-auto">
                    <div className="ml-auto cursor-pointer mr-3 text-xl font-semibold items-center text-gray-200 flex">
                        <div className="h-[6vh] w-[6vh] rounded-full bg-slate-400 overflow-hidden mr-3">
                            <img src={pfp || `https://api.dicebear.com/7.x/notionists/svg/seed=${username}`} alt={`Profile pic of ${displayname}`} className="object-cover" width={"100%"} height={"100%"} />
                        </div>
                        <div className="h-[6vh] flex items-center">
                            {displayname}
                        </div>
                    </div>
                </a>
            }
        </nav>
    )
}
