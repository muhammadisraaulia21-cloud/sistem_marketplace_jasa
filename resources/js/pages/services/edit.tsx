import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: number;
}

interface EditProps {
    service: Service;
}

export default function Edit({ service }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: service.title,
        description: service.description,
        price: service.price.toString(),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/services/${service.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Jasa" />

            <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Edit Jasa</h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Input Judul Jasa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Jasa
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Contoh: Jasa Desain Poster Acara Kampus"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Input Deskripsi Jasa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Jasa
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Jelaskan detail layanan..."
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Input Harga Jasa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Harga (Rp)
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Contoh: 50000"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                            )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end items-center space-x-3 pt-2">
                            <Link
                                href={`/services/${service.id}`}
                                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
