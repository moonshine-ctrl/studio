'use client';
import type { LeaveRequest, User, Department, LeaveType } from '@/types';
import { format, differenceInDays } from 'date-fns';
import Image from 'next/image';

interface LeaveLetterProps {
    request: LeaveRequest;
    user: User;
    department: Department;
    leaveType: LeaveType;
    letterNumber: string;
    approver?: User;
    headOfAgency?: User;
}

const styles = {
  table: "w-full border-collapse border border-black",
  cell: "border border-black p-1",
  cellHeader: "border border-black p-1 text-left",
  cellCenter: "border border-black p-1 text-center",
  outerBorder: "border-2 border-black p-4"
};

const Cell = ({ children, className = '', colSpan = 1, isHeader = false }) => (
    <td colSpan={colSpan} className={`${isHeader ? styles.cellHeader : styles.cell} ${className}`}>
        {children}
    </td>
);

export function LeaveLetter({ request, user, department, leaveType, letterNumber, approver, headOfAgency }: LeaveLetterProps) {
    
    const duration = differenceInDays(request.endDate, request.startDate) + 1;
    const leaveTypeCheck = (type: string) => leaveType.name === type ? 'V' : '';

    return (
        <div className="bg-white p-8 font-serif text-xs">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-4 border-b-2 border-black pb-2">
                    <div className="flex items-center justify-center gap-4">
                        <Image src="/logo.png" alt="Logo" width={60} height={60} />
                        <div>
                            <h1 className="font-bold text-sm">MAHKAMAH AGUNG REPUBLIK INDONESIA</h1>
                            <h2 className="font-bold text-sm">DIREKTORAT JENDERAL BADAN PERADILAN AGAMA</h2>
                            <h3 className="font-bold text-base">PENGADILAN TINGGI AGAMA PADANG</h3>
                            <h3 className="font-bold text-lg">PENGADILAN AGAMA SOLOK</h3>
                            <p className="text-xs">Jln. Kapten Bahar Hamid Kel. Laing Kec. Tanjung Harapan Kota Solok, Sumatera Barat 27325</p>
                            <p className="text-xs">Telp. (0778) 3210231 www.pa-solok.go.id, pa.solok@pta-padang.go.id</p>
                        </div>
                    </div>
                </header>

                <h4 className="font-bold text-center underline mb-1">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</h4>
                <p className="text-center mb-4">Nomor: {letterNumber}</p>

                <div className={styles.outerBorder}>
                    {/* SECTION I */}
                    <p className="font-bold">I. DATA PEGAWAI</p>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell isHeader>Nama</Cell>
                                <Cell>{user.name}</Cell>
                                <Cell isHeader>NIP</Cell>
                                <Cell>{user.nip}</Cell>
                            </tr>
                            <tr>
                                <Cell isHeader>Jabatan</Cell>
                                <Cell>{user.role}</Cell>
                                <Cell isHeader>Gol. Ruang</Cell>
                                <Cell></Cell>
                            </tr>
                            <tr>
                                <Cell isHeader>Unit Kerja</Cell>
                                <Cell>{department.name}</Cell>
                                <Cell isHeader>Masa Kerja</Cell>
                                <Cell></Cell>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION II */}
                    <p className="font-bold mt-4">II. JENIS CUTI YANG DIAMBIL **</p>
                     <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell>1. Cuti Tahunan <span className="float-right">{leaveTypeCheck('Annual')}</span></Cell>
                                <Cell>2. Cuti Besar <span className="float-right">{leaveTypeCheck('Other')}</span></Cell>
                            </tr>
                             <tr>
                                <Cell>3. Cuti Sakit <span className="float-right">{leaveTypeCheck('Sick')}</span></Cell>
                                <Cell>4. Cuti Melahirkan <span className="float-right">{leaveTypeCheck('Maternity')}</span></Cell>
                            </tr>
                            <tr>
                                <Cell>5. Cuti Karena Alasan Penting <span className="float-right">{leaveTypeCheck('Important Reason')}</span></Cell>
                                <Cell>6. Cuti di Luar Tanggungan Negara <span className="float-right">{leaveTypeCheck('Unpaid')}</span></Cell>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION III */}
                    <p className="font-bold mt-4">III. ALASAN CUTI</p>
                    <div className={`${styles.cell} h-10`}>{request.reason}</div>

                    {/* SECTION IV */}
                    <p className="font-bold mt-4">IV. LAMANYA CUTI</p>
                    <table className={styles.table}>
                         <tbody>
                            <tr>
                                <Cell>Selama</Cell>
                                <Cell>{duration} (hari/bulan/tahun)*</Cell>
                                <Cell>mulai tanggal</Cell>
                                <Cell>{format(request.startDate, 'dd-MM-yyyy')}</Cell>
                                <Cell>s/d</Cell>
                                <Cell>{format(request.endDate, 'dd-MM-yyyy')}</Cell>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION V */}
                    <p className="font-bold mt-4">V. CATATAN CUTI ***</p>
                     <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell colSpan={3}>1. CUTI TAHUNAN</Cell>
                                <Cell rowSpan={5} className="align-top">PARAF PETUGAS CUTI</Cell>
                                <Cell colSpan={2}>2. CUTI BESAR</Cell>
                            </tr>
                            <tr>
                                <Cell>Tahun</Cell>
                                <Cell>Sisa</Cell>
                                <Cell>Keterangan</Cell>
                                <Cell colSpan={2}>3. CUTI SAKIT</Cell>
                            </tr>
                            <tr>
                                <Cell>N-2</Cell><Cell></Cell><Cell></Cell>
                                <Cell colSpan={2}>4. CUTI MELAHIRKAN</Cell>
                            </tr>
                             <tr>
                                <Cell>N-1</Cell><Cell></Cell><Cell></Cell>
                                <Cell colSpan={2}>5. CUTI KARENA ALASAN PENTING</Cell>
                            </tr>
                             <tr>
                                <Cell>N</Cell><Cell>{user.annualLeaveBalance}</Cell><Cell></Cell>
                                <Cell colSpan={2}>6. CUTI DILUAR TANGGUNGAN NEGARA</Cell>
                            </tr>
                        </tbody>
                    </table>

                     {/* SECTION VI */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="font-bold">VI. ALAMAT SELAMA MENJALANKAN CUTI</p>
                            <table className={styles.table}>
                                <tbody>
                                    <tr>
                                        <td className={`${styles.cell} h-24 align-top`}></td>
                                        <td className={styles.cell}>TELP:</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                         <div className="text-center">
                            <p>Hormat saya,</p>
                            {user.qrCodeSignature ? (
                                <Image src={user.qrCodeSignature} alt="QR Code" width={70} height={70} className="mx-auto my-1" />
                            ) : (
                                <div className="h-[70px]"></div>
                            )}
                            <p>({user.name})</p>
                            <p>NIP. {user.nip}</p>
                        </div>
                    </div>
                    
                    {/* SECTION VII */}
                    <p className="font-bold mt-4">VII. PERTIMBANGAN ATASAN LANGSUNG</p>
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell className={styles.cellCenter}>DISETUJUI</Cell>
                                <Cell className={styles.cellCenter}>PERUBAHAN****</Cell>
                                <Cell className={styles.cellCenter}>DITANGGUHKAN****</Cell>
                                <Cell className={styles.cellCenter}>TIDAK DISETUJUI****</Cell>
                            </tr>
                            <tr>
                                <td colSpan={4} className={`${styles.cell}`}>
                                    <div className="text-center float-right w-1/2">
                                        <p>Atasan Langsung,</p>
                                        <div className="h-[70px]"></div>
                                        <p>({approver?.name || '.......................'})</p>
                                        <p>NIP. {approver?.nip || '.......................'}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION VIII */}
                    <p className="font-bold mt-4">VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI **</p>
                     <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell className={styles.cellCenter}>DISETUJUI</Cell>
                                <Cell className={styles.cellCenter}>PERUBAHAN****</Cell>
                                <Cell className={styles.cellCenter}>DITANGGUHKAN****</Cell>
                                <Cell className={styles.cellCenter}>TIDAK DISETUJUI****</Cell>
                            </tr>
                            <tr>
                                <td colSpan={4} className={`${styles.cell}`}>
                                    <div className="text-center float-right w-1/2">
                                        <p>Ketua,</p>
                                        <div className="h-[70px]"></div>
                                        <p>({headOfAgency?.name || '.......................'})</p>
                                        <p>NIP. {headOfAgency?.nip || '.......................'}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <footer className="mt-4 text-xs">
                    <p>Catatan:</p>
                    <ul className="list-disc list-inside">
                        <li>* Coret yang tidak perlu</li>
                        <li>** Pilih salah satu dengan memberi tanda centang (V)</li>
                        <li>*** diisi oleh pejabat yang menangani bidang kepegawaian sebelum PNS mengajukan cuti</li>
                        <li>**** diberi tanda centang dan alasan</li>
                        <li>N = Cuti tahun berjalan</li>
                        <li>N-1 = Sisa cuti 1 tahun sebelumnya</li>
                        <li>N-2 = Sisa cuti 2 tahun sebelumnya</li>
                    </ul>
                </footer>
            </div>
            <style jsx global>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
