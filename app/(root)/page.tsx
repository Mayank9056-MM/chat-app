import { currentUser } from "@/modules/auth/actions";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";

const Home = async () => {
  const user = await currentUser();

  return (
    <>
      <ChatMessageView user={user} />
    </>
  );
};

export default Home;
