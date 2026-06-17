"use client";

import { useDeleteChat } from "@/modules/chat/hooks/use-chats";
import Modal from "./ui/modal";
import { toast } from "sonner";

const DeleteChatModal = ({ isModalOpen, setIsModalOpen, chatId }) => {
  const { mutateAsync, isPending } = useDeleteChat(chatId);

  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success("Chat deleted successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return (
    <Modal
      title="Delete Chat"
      description="Are you sure you want to delete this chat? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
    >
      <p className="text-sm text-zinc-500">
        Once deleted, all requests and data in this chat will be permanently
        deleted.
      </p>
    </Modal>
  );
};

export default DeleteChatModal;
