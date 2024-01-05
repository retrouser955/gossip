import { useRef, useState } from "react"
import { UserContextValues, useUser } from "../../hooks/useUser"

export default function ProfileEdit() {
  const { displayname: currentDisplayname, username: currentUsername, user } = useUser() as UserContextValues

  const [displayName, setDisplayname] = useState(currentDisplayname)
  const [usrname, setUsrname] = useState(currentUsername)
  const file = useRef("")

  const fileSelector = useRef<HTMLInputElement | null>(null)

  return (
    <div className="w-full h-full p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="displayname">
            Display Name
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="displayname" type="text" placeholder="Display Name" defaultValue={displayName} maxLength={20} onChange={(v) => setDisplayname(v.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" defaultValue={currentUsername} maxLength={20} onChange={(v) => setUsrname(v.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="pfp" className="block text-gray-300 text-sm font-bold mb-2">Select Profile Picture</label>
          <input type="file" id="pfp" className="hidden" ref={fileSelector} onChange={async (v) => {
            console.log("starton")

            const files = v.target.files as FileList
            
            const indivFile = files[0]

            const reader = new FileReader()
            reader.readAsDataURL(indivFile)

            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = function() {
                resolve(reader.result as string)
              }

              reader.onerror = function(error) {
                reject(error)
              }
            })

            file.current = base64

            console.log(base64)

            console.log('passed')
          }} />
          <button className="mt-2 hover:bg-green-900 transition-all w-40 h-10 text-lg text-gray-300 border-2 rounded-lg border-blue-600" onClick={async () => {
            fileSelector.current?.click()
          }}>Select Avatar</button>
        </div>
        <button className="mt-2 hover:bg-green-900 transition-all w-20 h-10 text-lg text-gray-300 border-2 rounded-lg border-blue-600" onClick={async () => {
          if (!displayName) return alert('Must choose a display name!')
          if (!usrname) return alert("You must choose a username")

          const promises: Promise<void>[] = []

          if (usrname != currentUsername) promises.push(new Promise<void>((res) => user.get("alias").put(usrname, () => res())))

          promises.push(new Promise<void>((res) => user.get('displayname').put(displayName, () => res())))

          console.log(file)

          promises.push(new Promise<void>((res) => user.get("profilepic").put(file.current, () => res())))

          await Promise.all(promises)

          alert('Changes saved!')
        }}>Save</button>
      </form>
    </div>
  )
}
