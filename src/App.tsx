import { useState } from "react"
import { UserContextValues, useMainUser } from "./hooks/MainUser/useMainUser"
import Swal from "sweetalert2"

function App() {
  const { login, signUp, username } = useMainUser() as UserContextValues
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <>
      <div className="mt-[10vh] flex items-center justify-center w-screen h-[90vh] bg-emerald-900">
        {
          username ?
              <a href="/chat"><div className="my-auto text-4xl font-bold flex items-center justify-center cursor-pointer w-80 rounded-full text-white h-16 bg-green-700 hover:bg-blue-950 transition-all hover:shadow-xl">Enter Gossip</div></a>
            :
            <div className="w-[30vw] flex items-center rounded-xl shadow-lg h-[70vh] bg-emerald-950">
              <form className="rounded w-full px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" onChange={(e) => setUser(e.target.value)} />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onChange={(e) => setPassword(e.target.value)} />
                  {
                    !password && <p className="text-red-500 text-xs italic">Please choose a password.</p>
                  }
                </div>
                <div className="flex items-center">
                  <button className="bg-green-500 transition-all hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" disabled={loading} onClick={() => {
                    if (!user || !password) return alert("Username or Password need to be defined")
                    setLoading(true)
                    login(user, password).catch(err => {
                      setLoading(false)
                      alert(err)
                    }).then(() => setLoading(false))
                  }}>
                    Sign In
                  </button>
                  <button className="bg-green-500 transition-all ml-3 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" disabled={loading} onClick={() => {
                    setLoading(true)

                    signUp(user, password).catch(err => {
                      setLoading(false)
                      alert(err)
                    }).then(() => setLoading(false)).catch((reason: string) => {
                      Swal.fire("Error", reason, "error")
                    })
                  }}>
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
        }
      </div>
    </>
  )
}

export default App
