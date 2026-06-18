import { ModeToggle } from "./mode-toggle";

const Header = () => {
  return (
    <div className="flex h-12 w-full flex-row justify-end items-center border-b border-white/[0.06] bg-transparent px-4">
      <ModeToggle />
    </div>
  );
};

export default Header;