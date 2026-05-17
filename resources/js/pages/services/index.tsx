import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Service {
    id: number;
    user_id: number;
    title: string;
    description: string;
    price: number;
    user?: {
        name: string;
    };
}

interface IndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    services: Service[];
}


export default function Index({ auth, services = [] }: IndexProps) {
    const { delete: destroy } = useForm();

    return (
        <AppLayout>
            <Head title="Katalog Jasa" />

            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Daftar Jasa yang Tersedia</h3>
                        <div className="flex items-center gap-3">
                            {/* [BARU] Link ke halaman riwayat transaksi */}
                            {auth?.user && (
                                <Link
                                    href="/orders"
                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium transition border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50"
                                >
                                    Riwayat Transaksi
                                </Link>
                            )}
                            <Link
                                href="/services/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium shadow-sm"
                            >
                                + Tawarkan Jasa Kamu
                            </Link>
                        </div>
                    </div>

                    {/* Grid Jasa */}
                    {services.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-gray-500">Belum ada jasa yang ditawarkan saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex flex-col justify-between"
                                >
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Oleh: {service.user?.name ?? 'Anonim'}
                                        </p>
                                        <h4 className="font-bold text-lg text-gray-800">{service.title}</h4>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{service.description}</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-blue-600 font-bold mb-3">
                                            Rp {service.price.toLocaleString('id-ID')}
                                        </p>

                                        {/* [DIPERBARUI] Tombol Lihat Detail sekarang mengarah ke /services/{id} */}
                                        <Link
                                            href={`/services/${service.id}`}
                                            className="block w-full text-center bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium mb-2"
                                        >
                                            Lihat Detail
                                        </Link>

                                        {/* Tombol Hapus: hanya untuk pemilik */}
                                        {auth?.user?.id === service.user_id && (
                                            <button
                                                className="w-full bg-red-50 text-red-600 py-2 rounded-md hover:bg-red-100 transition text-sm font-medium"
                                                onClick={() => {
                                                    if (confirm('Apakah Anda yakin ingin menghapus jasa ini?')) {
                                                        destroy(`/services/${service.id}`);
                                                    }
                                                }}
                                            >
                                                Hapus Jasa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
