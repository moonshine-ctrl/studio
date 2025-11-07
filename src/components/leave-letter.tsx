'use client';
import type { LeaveRequest, User, Department, LeaveType } from '@/types';
import { format, differenceInYears, differenceInMonths } from 'date-fns';
import Image from 'next/image';
import { settings } from '@/lib/data';

interface LeaveLetterProps {
    request: LeaveRequest;
    user: User;
    department: Department;
    leaveType?: LeaveType;
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

const Cell = ({ children, className = '', colSpan = 1, isHeader = false, rowSpan = 1 }: { children: React.ReactNode, className?: string, colSpan?: number, rowSpan?: number, isHeader?: boolean }) => (
    <td colSpan={colSpan} rowSpan={rowSpan} className={`${isHeader ? styles.cellHeader : styles.cell} ${className}`}>
        {children}
    </td>
);

export function LeaveLetter({ request, user, department, leaveType, letterNumber, approver, headOfAgency }: LeaveLetterProps) {
    
    const duration = request.days;
    const leaveTypeCheck = (type: string) => leaveType?.name === type ? 'V' : '';
    const currentYear = new Date().getFullYear();
    
    const calculateMasaKerja = (joinDate?: Date): string => {
        if (!joinDate) return '.......................';
        const now = new Date();
        const years = differenceInYears(now, joinDate);
        const months = differenceInMonths(now, joinDate) % 12;
        if (years > 0) {
            return `${years} tahun, ${months} bulan`;
        }
        return `${months} bulan`;
    }

    return (
        <div className="bg-white p-8 font-serif text-xs">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-4 border-b-2 border-black pb-2">
                    <div className="flex items-center justify-center gap-4">
                         {settings.logoUrl && <Image src={settings.logoUrl} alt="Logo" width={70} height={70} className="object-contain" />}
                        <div>
                            <h1 className="font-bold text-sm">{settings.letterhead[0]}</h1>
                            <h2 className="font-bold text-sm">{settings.letterhead[1]}</h2>
                            <h3 className="font-bold text-base">{settings.letterhead[2]}</h3>
                            <h3 className="font-bold text-lg">{settings.letterhead[3]}</h3>
                            <p className="text-xs">{settings.letterhead[4]}</p>
                            <p className="text-xs">{settings.letterhead[5]}</p>
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
                                <Cell>{user.golongan || '.......................'}</Cell>
                            </tr>
                            <tr>
                                <Cell isHeader>Unit Kerja</Cell>
                                <Cell>{department.name}</Cell>
                                <Cell isHeader>Masa Kerja</Cell>
                                <Cell>{calculateMasaKerja(user.joinDate)}</Cell>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION II */}
                    <p className="font-bold mt-4">II. JENIS CUTI YANG DIAMBIL **</p>
                     <table className={styles.table}>
                        <tbody>
                            <tr>
                                <Cell>1. Cuti Tahunan <span className="float-right">{leaveTypeCheck('Cuti Tahunan')}</span></Cell>
                                <Cell>2. Cuti Besar <span className="float-right">{leaveTypeCheck('Cuti Besar')}</span></Cell>
                            </tr>
                             <tr>
                                <Cell>3. Cuti Sakit <span className="float-right">{leaveTypeCheck('Cuti Sakit')}</span></Cell>
                                <Cell>4. Cuti Melahirkan <span className="float-right">{leaveTypeCheck('Cuti Melahirkan')}</span></Cell>
                            </tr>
                            <tr>
                                <Cell>5. Cuti Karena Alasan Penting <span className="float-right">{leaveTypeCheck('Cuti Alasan Penting')}</span></Cell>
                                <Cell>6. Cuti di Luar Tanggungan Negara <span className="float-right">{leaveTypeCheck('Cuti di Luar Tanggungan Negara')}</span></Cell>
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
                                <Cell rowSpan={2} className="align-top">PARAF PETUGAS CUTI</Cell>
                            </tr>
                            <tr>
                                <Cell>Tahun</Cell>
                                <Cell>Sisa</Cell>
                                <Cell>Keterangan</Cell>
                            </tr>
                            <tr>
                                <Cell>{currentYear}</Cell>
                                <Cell>{user.annualLeaveBalance}</Cell>
                                <Cell></Cell>
                                <Cell></Cell>
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
                                        <td className={`${styles.cell} h-24 align-top`}>..................................</td>
                                        <td className={styles.cell}>TELP: ....................</td>
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
                                        {approver?.qrCodeSignature ? (
                                            <Image src={approver.qrCodeSignature} alt="QR Code" width={70} height={70} className="mx-auto my-1" />
                                        ) : (
                                            <div className="h-[70px]"></div>
                                        )}
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
                                        {headOfAgency?.qrCodeSignature ? (
                                            <Image src={headOfAgency.qrCodeSignature} alt="QR Code" width={70} height={70} className="mx-auto my-1" />
                                        ) : (
                                            <div className="h-[70px]"></div>
                                        )}
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
