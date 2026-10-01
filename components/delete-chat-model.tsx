"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDeleteChat } from "@/modules/chat/hooks/use-chats";
import Modal from "./ui/modal";
import { toast } from "sonner";

interface DeleteChatModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  chatId: string;
}

export const DeleteChatModal = ({
  isModalOpen,
  setIsModalOpen,
  chatId,
}: DeleteChatModalProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const { mutateAsync, isPending } = useDeleteChat(chatId);

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success("Conversation deleted");
      setIsModalOpen(false);

      // If the user deleted the active conversation they are viewing, redirect to home
      if (pathName === `/chat/${chatId}`) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <Modal
      title="Delete Conversation"
      description="Are you sure you want to permanently delete this conversation?"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
      size=""
    >
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-3">
        <p className="text-xs text-zinc-300 leading-relaxed">
          All messages and thinking traces in this session will be{" "}
          <span className="text-red-400 font-medium">permanently removed</span>.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteChatModal;