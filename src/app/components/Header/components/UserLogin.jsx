import { LogIn } from "lucide-react";

// Auth UI placeholder: logged-out state only. The user menu, admin-panel
// trigger, and logout re-attach here with the new auth layer.
export default function UserLogin() {
  return (
    <button className="w-40 flex items-center justify-center gap-2 border border-secondary-500 text-secondary-500 px-4 py-1.5 rounded-lg hover:bg-secondary-500 hover:text-primary-500 transition-colors font-medium text-xs">
      <LogIn size={14} />
      <span>Giriş</span>
    </button>
  );
}
