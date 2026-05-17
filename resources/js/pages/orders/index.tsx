import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';

// ─── Tipe Data ────────────────────────────────────────────────────────────────

type OrderStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

interface OrderService {
    id: number;
    title: string;
    user?: { name: string };
}

interface OrderUser {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    status: OrderStatus;
    price_at_order: number;
    created_at: string;
    note: string | null;
    service: OrderService;
    buyer?: OrderUser;
}

interface OrdersIndexProps {
    incomingOrders: Order[];
    outgoingOrders: Order[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending:   'Menunggu',
    accepted:  'Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

const STATUS_CLASS: Record<OrderStatus, string> = {
    pending:   'bg-yellow-100 text-yellow-800',
    accepted:  'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_CLASS[status]}`}>
            {STATUS_LABEL[status]}
        </span>
    );
}

// ─── Komponen Aksi untuk Seller ───────────────────────────────────────────────

function SellerActions({ order }: { order: Order }) {
    const { data, setData, patch, processing } = useForm({
        status: '',
    });

    const changeStatus = (status: string) => {
    router.patch(`/orders/${order.id}`, { status });
    };

    if (order.status === 'pending') {
        return (
            <div className="flex gap-2 mt-3">
                <button
                    onClick={() => changeStatus('accepted')}
                    disabled={processing}
                    className="flex-1 text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    Terima
                </button>
                <button
                    onClick={() => changeStatus('cancelled')}
                    disabled={processing}
                    className="flex-1 text-xs bg-red-50 text-red-600 py-1.5 rounded hover:bg-red-100 transition disabled:opacity-50"
                >
                    Tolak
                </button>
            </div>
        );
    }

    if (order.status === 'accepted') {
        return (
            <button
                onClick={() => changeStatus('completed')}
                disabled={processing}
                className="w-full mt-3 text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
                Tandai Selesai
            </button>
        );
    }

    return null;
}// ─── Kartu Pesanan ────────────────────────────────────────────────────────────

function OrderCard({ order, role }: { order: Order; role: 'buyer' | 'seller' }) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{order.service.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {role === 'seller'
                            ? `Pembeli: ${order.buyer?.name ?? '-'}`
                            : `Penjual: ${order.service.user?.name ?? '-'}`}
                    </p>
                </div>
                <StatusBadge status={order.status} />
            </div>

            <p className="text-blue-600 font-bold text-sm mt-2">
                Rp {order.price_at_order.toLocaleString('id-ID')}
            </p>

            <p className="text-xs text-gray-400 mt-1">
                {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                })}
            </p>

            {/* Aksi hanya untuk seller */}
            {role === 'seller' && <SellerActions order={order} />}
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────

export default function OrdersIndex({ incomingOrders, outgoingOrders }: OrdersIndexProps) {
    return (
        <AppLayout>
            <Head title="Riwayat Transaksi" />

            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Kolom Kiri: Pesanan Masuk (Saya sebagai Seller) */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                            Pesanan Masuk
                            <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {incomingOrders.length}
                            </span>
                        </h3>
                        <div className="space-y-3">
                            {incomingOrders.length === 0 ? (
                                <EmptyState message="Belum ada yang memesan jasa Anda." />
                            ) : (
                                incomingOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} role="seller" />
                                ))
                            )}
                        </div>
                    </section>

                    {/* Kolom Kanan: Pesanan Keluar (Saya sebagai Buyer) */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            Pesanan Saya
                            <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                {outgoingOrders.length}
                            </span>
                        </h3>
                        <div className="space-y-3">
                            {outgoingOrders.length === 0 ? (
                                <EmptyState message="Anda belum memesan jasa apapun." />
                            ) : (
                                outgoingOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} role="buyer" />
                                ))
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </AppLayout>
    );
}
