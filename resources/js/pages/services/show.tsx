import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Service {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: number;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    service: Service;
    hasOrdered: boolean;
}

export default function Show({ auth, service, hasOrdered }: ShowProps) {
    const { post, processing } = useForm();

    const handleOrder = () => {
        if (confirm(`Konfirmasi pemesanan jasa "${service.title}"?`)) {
            post(`/orders/${service.id}`);
        }
    };

    const isOwner = auth?.user?.id === service.user_id;
    const isLoggedIn = !!auth?.user;

    return (
        <AppLayout>
            <Head title={service.title} />

            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">

                {/* Tombol Kembali */}
                <Link
                    href="/services"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-5 transition"
                >
                    ← Kembali ke Katalog
                </Link>

                <div className="bg-white shadow-sm sm:rounded-lg border border-gray-100 overflow-hidden">

                    {/* Header Kartu */}
                    <div className="p-6 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                            Ditawarkan oleh: {service.user?.name ?? 'Anonim'}
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                        <p className="text-2xl font-bold text-blue-600 mt-3">
                            Rp {service.price.toLocaleString('id-ID')}
                        </p>
                    </div>

                    {/* Deskripsi Lengkap */}
                    <div className="p-6">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                            Deskripsi Jasa
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {service.description}
                        </p>
                    </div>

                    {/* Area Aksi */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">

                        {/* Pemilik jasa: tampilkan tombol edit */}
                        {isOwner && (
                            <Link
                                href={`/services/${service.id}/edit`}
                                className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                            >
                                Edit Jasa Ini
                            </Link>
                        )}

                        {/* Bukan pemilik: tampilkan tombol pesan */}
                        {!isOwner && isLoggedIn && (
                            <>
                                {hasOrdered ? (
                                    <div className="flex-1 text-center bg-green-50 text-green-700 py-2.5 rounded-md border border-green-200 text-sm font-medium">
                                        ✓ Sudah Dipesan
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleOrder}
                                        disabled={processing}
                                        className="flex-1 bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Pesan Jasa Ini'}
                                    </button>
                                )}
                            </>
                        )}

                        {/* Belum login */}
                        {!isLoggedIn && (
                            <Link
                                href="/login"
                                className="flex-1 text-center bg-gray-900 text-white py-2.5 rounded-md hover:bg-gray-800 transition text-sm font-medium"
                            >
                                Login untuk Memesan
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
