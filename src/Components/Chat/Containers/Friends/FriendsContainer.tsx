import { Link, useParams } from 'react-router-dom'

export default function FriendsContainer({ name, pfp, epub }: { name: string, pfp: string, epub: string }) {
    const { chatid } = useParams()

    return (
        <Link to={`/chat/${epub}`}>
            <div className={`w-[95%] mx-auto flex my-1 items-center rounded-md ${chatid === epub ? "bg-green-950" : "bg-green-900"} h-16`}>
                <div className="h-14 w-14 ml-2 overflow-hidden">
                    <img src={pfp} alt={`${name}'s Profile picture`} className="rounded-full overflow-hidden" />
                </div>
                <h1 className="text-white ml-4 w-fit text-2xl font-bold">{name}</h1>
            </div>
        </Link>
    )
}
