import { currentUser } from "@/modules/auth/actions";
import ChatMessageView from "@/modules/chat/components/chat-view/chat-message-view";
import PublicLanding from "@/components/marketing/public-landing";

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return <PublicLanding />;
  }

  return <ChatMessageView user={user} />;
};

export default Home;
