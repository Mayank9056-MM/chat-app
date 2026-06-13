import { currentUser } from "@/modules/auth/actions"
import { User } from "@/modules/auth/types";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";

const Home = async() => {

  const user = await currentUser() as User;

  return (
   <>
     <ChatMessageView user={user} />
   </>
  )
}

export default Home