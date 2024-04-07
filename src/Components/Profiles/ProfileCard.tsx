import Swal from "sweetalert2";
import { UserContextValues } from "../../hooks/MainUser/useMainUser";

interface ProfileCardOptions {
    username: string;
    pfp: string;
    displayname: string;
    logout: UserContextValues['logout'],
    bio: string;
    showLogout?: boolean;
    deleteAccount: UserContextValues['deleteAccount']
}

export default function ProfileCard({ username, displayname, pfp, logout, bio, showLogout, deleteAccount }: ProfileCardOptions) {
    return (
        <div className="w-96 overflow-hidden rounded-xl bg-gradient-to-b from-emerald-800 to-green-800 hover:shadow-2xl transition-all">
            <div className="w-full pt-10 h-28 bg-gray-700">
                <div className="w-32 ml-4 h-32 overflow-hidden bg-gray-600 rounded-full">
                    <img src={pfp || `https://api.dicebear.com/7.x/notionists/svg/seed=${username}`} className="" alt={`${username}'s profile picture`} />
                </div>
                <div className="ml-4 text-2xl font-semibold text-white">{displayname ?? username}</div>
                <div className="ml-4 font-semibold text-gray-400">{username}</div>
                <div className="w-full mt-5 px-4 text-gray-300 text-sm">
                    <p className="text-lg mb-2 font-bold text-gray-100">BIO</p>
                    {bio.split("\n").map((text, i) => <>{i != 0 && <br/>}{text}</>)}
                </div>
                {
                    showLogout && <>
                        <button className="ml-3 mt-5 hover:bg-green-900 transition-all w-20 h-10 text-lg text-gray-300 border-2 rounded-lg border-red-500" onClick={() => {
                            logout()
                            window.location.replace(window.location.origin)
                        }}>Logout</button>
                        <button className="ml-3 mt-5 hover:bg-green-900 transition-all w-20 h-10 text-lg text-gray-300 border-2 rounded-lg border-red-500" onClick={async () => {
                            const { value: formValues } = await Swal.fire({
                                title: "Delete your account?",
                                html: `
                                    <h4 class="text-gray-400">Username</h4>
                                    <input id="swal-input1" class="swal2-input">
                                    <h4 class="text-gray-400">Password<h4>
                                    <input id="swal-input2" class="swal2-input">
                                `,
                                focusConfirm: false,
                                preConfirm: () => {
                                    return [
                                        (document.getElementById("swal-input1") as HTMLInputElement).value,
                                        (document.getElementById("swal-input2") as HTMLInputElement).value
                                    ];
                                }
                            });
                            if (formValues) {
                                const [username, password] = formValues as Array<string>
                                window.location.replace(window.location.origin)
                                deleteAccount(username, password)
                            }
                        }}>Delete</button>
                    </>
                }
            </div>
        </div>
    )
}
