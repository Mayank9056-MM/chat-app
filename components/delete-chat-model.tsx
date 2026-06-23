"use client";

import { useDeleteChat } from "@/modules/chat/hooks/use-chats";
import Modal from "./ui/modal";
import { toast } from "sonner";

interface DeleteChatModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  chatId: string;
}

const DeleteChatModal = ({
  isModalOpen,
  setIsModalOpen,
  chatId,
}: DeleteChatModalProps) => {
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
      submitText={isPending ? "Deleting…" : "Delete"}
      submitVariant="destructive"
      size={""}
    >
      {/*
        Slightly warmer tone than plain zinc — red-400/10 tint reinforces the
        destructive nature without being alarming. The icon + text pairing gives
        the warning more weight on small screens where the modal title may be
        truncated.
      */}
      <div className="rounded-lg bg-red-500/[0.06] border border-red-500/[0.12] px-3.5 py-3">
        <p className="text-sm text-zinc-400 leading-relaxed">
          All messages and data in this chat will be{" "}
          <span className="text-zinc-300 font-medium">permanently removed</span>{" "}
          and cannot be recovered.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteChatModal;