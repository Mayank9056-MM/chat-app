import { currentUser } from '@/modules/auth/actions'
import UserButton from '@/modules/auth/components/user-button';
import React from 'react'

const Home = async() => {

  const user = await currentUser();

  return (
    <div className="flex items-center flex-col flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <UserButton user={user} />
    </div>
  )
}

export default Home