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
  cellHeader: "border border-black p-1 font-bold",
  cellCenter: "border border-black p-1 text-center",
  outerBorder: "border-2 border-black",
};


const PrintHeaderContent = ({ isRepeating = false }: { isRepeating?: boolean }) => (
    <header className={`text-center mb-2 border-b-2 border-black pb-2 ${isRepeating ? 'print-header-repeating' : ''}`}>
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
);

const SignatureBlock = ({ user, qrCode, name, nip, signatureDate, title, align = 'center' }: { user?: User, qrCode?: string, name?: string, nip?: string, signatureDate?: Date, title?: string, align?: 'left' | 'center' | 'right' }) => {
    const signatureQr = qrCode || user?.qrCodeSignature;
    const signatureName = name || user?.name || '.......................';
    const signatureNip = nip || user?.nip || '.......................';
    const dateToDisplay = signatureDate ? format(signatureDate, 'dd-MM-yyyy') : '...................';

    return (
        <div className={`text-${align}`}>
            {title && <p className="mb-1">{title}</p>}
            {!title && <p className="mb-1">{dateToDisplay}</p>}
            <div className="h-16 w-16 mx-auto my-1 flex items-center justify-center">
                {signatureQr ? (
                    <Image src={signatureQr} alt="QR Code" width={64} height={64} className="mx-auto" />
                ) : (
                    <div className="h-[64px]"></div>
                )}
            </div>
            <p className="underline font-bold mt-1">{signatureName}</p>
            <p>NIP. {signatureNip}</p>
        </div>
    );
};


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

    const allApprovers = approver ? [approver] : [];


    return (
        <div className="bg-white p-4 font-serif text-xs" id="print-area">
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print-header-repeating {
                        display: block !important;
                        position: fixed;
                        top: 1.5cm;
                        left: 1.5cm;
                        right: 1.5cm;
                        background-color: white;
                        z-index: 10;
                    }
                    .section-container {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    .main-header {
                        visibility: hidden;
                        height: 100px; /* Match header height */
                    }
                }
                .print-header-repeating {
                    display: none;
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                <PrintHeaderContent />
                
                <h4 className="font-bold text-center underline mb-1 mt-4">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</h4>
                <p className="text-center mb-2">Nomor: {letterNumber}</p>

                <div className={styles.outerBorder}>
                    {/* SECTION I */}
                    <div className="section-container">
                        <p className="font-bold pl-1">I. DATA PEGAWAI</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cell} style={{width: '15%'}}>Nama</td>
                                    <td className={styles.cell} style={{width: '55%'}}>{user.name}</td>
                                    <td className={styles.cell} style={{width: '10%'}}>NIP</td>
                                    <td className={styles.cell} style={{width: '20%'}}>{user.nip}</td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>Jabatan</td>
                                    <td className={styles.cell}>{user.role}</td>
                                    <td className={styles.cell}>Masa Kerja</td>
                                    <td className={styles.cell}>{calculateMasaKerja(user.joinDate)}</td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>Unit Kerja</td>
                                    <td className={styles.cell} colSpan={3}>{department.name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* SECTION II */}
                     <div className="section-container mt-2">
                        <p className="font-bold pl-1">II. JENIS CUTI YANG DIAMBIL **</p>
                         <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={`${styles.cell} w-1/2`}>1. Cuti Tahunan <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti Tahunan')}</span></td>
                                    <td className={`${styles.cell} w-1/2`}>2. Cuti Besar <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti Besar')}</span></td>
                                </tr>
                                 <tr>
                                    <td className={styles.cell}>3. Cuti Sakit <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti Sakit')}</span></td>
                                    <td className={styles.cell}>4. Cuti Melahirkan <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti Melahirkan')}</span></td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>5. Cuti Karena Alasan Penting <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti Alasan Penting')}</span></td>
                                    <td className={styles.cell}>6. Cuti di Luar Tanggungan Negara <span className="float-right font-bold text-lg pr-2">{leaveTypeCheck('Cuti di Luar Tanggungan Negara')}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* SECTION III */}
                    <div className="section-container mt-2">
                        <p className="font-bold pl-1">III. ALASAN CUTI</p>
                        <div className={`${styles.cell} min-h-[2rem]`}>{request.reason}</div>
                    </div>

                    {/* SECTION IV */}
                     <div className="section-container mt-2">
                        <p className="font-bold pl-1">IV. LAMANYA CUTI</p>
                        <table className={styles.table}>
                             <tbody>
                                <tr>
                                    <td className={styles.cell} style={{width: '10%'}}>Selama</td>
                                    <td className={styles.cell} style={{width: '30%'}}>{duration} (hari/bulan/tahun)*</td>
                                    <td className={styles.cell} style={{width: '15%'}}>mulai tanggal</td>
                                    <td className={styles.cell} style={{width: '20%'}}>{format(request.startDate, 'dd-MM-yyyy')}</td>
                                    <td className={styles.cell} style={{width: '5%'}}>s/d</td>
                                    <td className={styles.cell} style={{width: '20%'}}>{format(request.endDate, 'dd-MM-yyyy')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* SECTION V */}
                    <div className="section-container mt-2">
                        <p className="font-bold pl-1">V. CATATAN CUTI ***</p>
                         <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={`${styles.cell} font-bold`} colSpan={3}>1. CUTI TAHUNAN</td>
                                    <td className={`${styles.cellCenter} align-middle`} rowSpan={4}>
                                        <div className="h-full flex flex-col justify-between">
                                            <p>PARAF PETUGAS CUTI</p>
                                            <div className="h-12"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styles.cellCenter}>Tahun</td>
                                    <td className={styles.cellCenter}>Sisa</td>
                                    <td className={styles.cellCenter}>Keterangan</td>
                                </tr>
                                <tr>
                                    <td className={styles.cellCenter}>{currentYear - 1}</td>
                                    <td className={styles.cellCenter}>-</td>
                                    <td className={styles.cell}></td>
                                </tr>
                                 <tr>
                                    <td className={styles.cellCenter}>{currentYear}</td>
                                    <td className={styles.cellCenter}>{user.annualLeaveBalance}</td>
                                    <td className={styles.cell}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* SECTION VI */}
                    <div className="section-container mt-2">
                        <p className="font-bold pl-1">VI. ALAMAT SELAMA MENJALANKAN CUTI</p>
                         <table className={styles.table}>
                            <tbody>
                              <tr>
                                <td className={`${styles.cell} w-2/3 align-top`} style={{height: '110px'}}>
                                    <p>..................................</p>
                                    <p>Catatan Kepegawaian:</p>
                                </td>
                                <td className={`${styles.cell} w-1/3 align-top text-center`}>
                                    <div className='flex flex-col h-full'>
                                        <p>Hormat saya,</p>
                                        <div className='flex-grow flex items-center justify-center'>
                                            {user.qrCodeSignature && <Image src={user.qrCodeSignature} alt="QR Code" width={50} height={50} />}
                                        </div>
                                        <p className="underline font-bold">{user.name}</p>
                                        <p>NIP. {user.nip}</p>
                                    </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                    </div>
                    
                    {/* SECTION VII */}
                    <div className="section-container mt-2">
                        <p className="font-bold pl-1">VII. PERTIMBANGAN ATASAN LANGSUNG **</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cellCenter}>DISETUJUI</td>
                                    <td className={styles.cellCenter}>PERUBAHAN****</td>
                                    <td className={styles.cellCenter}>DITANGGUHKAN****</td>
                                    <td className={`${styles.cell} w-1/3 text-center align-top`} rowSpan={2}>
                                        {approver && <SignatureBlock user={approver} signatureDate={new Date()} />}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className={`${styles.cell} h-[100px] align-top`}>
                                         <span className='font-bold text-lg pl-2'>{request.status === 'Approved' ? 'V' : ''}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* SECTION VIII */}
                    <div className="section-container mt-2">
                        <p className="font-bold pl-1">VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI **</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cellCenter}>DISETUJUI</td>
                                    <td className={styles.cellCenter}>PERUBAHAN****</td>
                                    <td className={styles.cellCenter}>DITANGGUHKAN****</td>
                                    <td className={`${styles.cell} w-1/3 text-center align-top`} rowSpan={2}>
                                         {headOfAgency && <SignatureBlock user={headOfAgency} signatureDate={new Date()} />}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className={`${styles.cell} h-[100px] align-top`}>
                                        <span className='font-bold text-lg pl-2'>{request.status === 'Approved' ? 'V' : ''}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
