import { AddDealModal } from "./AddDealModal";

export function DealsToolbar() {
  return (
    <div className="flex items-center justify-end">
      <AddDealModal />
    </div>
  );
}