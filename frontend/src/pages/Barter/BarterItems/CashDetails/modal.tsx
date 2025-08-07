import { X } from "lucide-react";
import ModalWrapper from "../../../../components/layout/ModalWrapper";
import CashDetailsGrid from "./grid";

type Props = {
  open: boolean;
  onClose: () => void;
  barterItemId: string;
};

const CashDetailsModal = ({ open, onClose, barterItemId }: Props) => {
  return (
    <ModalWrapper open={open} onClose={onClose}>
      <div className="bg-white py-4 px-7 rounded-xl shadow-xl w-full max-w-6xl max-h-[100vh] overflow-y-auto dark:bg-primary dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Nakit Anlaşma Detayları
        </h2>

        <CashDetailsGrid barterItemId={barterItemId} />
      </div>
    </ModalWrapper>
  );
};

export default CashDetailsModal;
