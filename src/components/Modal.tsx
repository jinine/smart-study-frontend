type Props = {
    openClose: any, 
    children: any
}
const Modal = ({ openClose, children }: Props) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                    onClick={openClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;