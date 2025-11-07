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
  outerBorder: "border-2 border-black p-4",
  sectionContainer: "break-inside-avoid",
};


const PrintHeaderContent = () => (
    <header className="text-center mb-2 border-b-2 border-black pb-2">
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


const SignatureBlock = ({ user, qrCode, name, nip, signatureDate, title }: { user?: User, qrCode?: string, name?: string, nip?: string, signatureDate?: Date, title?: string }) => {
    const signatureQr = qrCode || user?.qrCodeSignature;
    const signatureName = name || user?.name || '.......................';
    const signatureNip = nip || user?.nip || '.......................';
    const dateToDisplay = signatureDate ? format(signatureDate, 'dd/MM/yyyy') : '.../.../......';

    return (
        <div className="text-center">
            {title && <p className="mb-1">{title}</p>}
            <p className='mb-1'>{dateToDisplay}</p>
            <div className="h-16 w-16 mx-auto my-1 flex items-center justify-center">
                {signatureQr ? (
                    <Image src={signatureQr} alt="QR Code" width={64} height={64} className="mx-auto" />
                ) : (
                    <div className="h-[64px]"></div>
                )}
            </div>
            <p className="underline font-bold mt-1">({signatureName})</p>
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
        <div className="bg-white p-8 font-serif text-xs">
            <div className="max-w-4xl mx-auto" id="print-area">
                <PrintHeaderContent />
                
                <h4 className="font-bold text-center underline mb-1 mt-2">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</h4>
                <p className="text-center mb-2">Nomor: {letterNumber}</p>

                <div className={styles.outerBorder}>
                    {/* SECTION I */}
                    <section className={styles.sectionContainer}>
                        <p className="font-bold">I. DATA PEGAWAI</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cellHeader} style={{width: '15%'}}>Nama</td>
                                    <td className={styles.cell} style={{width: '35%'}}>{user.name}</td>
                                    <td className={styles.cellHeader} style={{width: '15%'}}>NIP</td>
                                    <td className={styles.cell} style={{width: '35%'}}>{user.nip}</td>
                                </tr>
                                <tr>
                                    <td className={styles.cellHeader}>Jabatan</td>
                                    <td className={styles.cell}>{user.role}</td>
                                    <td className={styles.cellHeader}>Gol. Ruang</td>
                                    <td className={styles.cell}>{user.golongan || '.......................'}</td>
                                </tr>
                                <tr>
                                    <td className={styles.cellHeader}>Unit Kerja</td>
                                    <td className={styles.cell}>{department.name}</td>
                                    <td className={styles.cellHeader}>Masa Kerja</td>
                                    <td className={styles.cell}>{calculateMasaKerja(user.joinDate)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    
                    {/* SECTION II */}
                     <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">II. JENIS CUTI YANG DIAMBIL **</p>
                         <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cell}>1. Cuti Tahunan <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti Tahunan')}</span></td>
                                    <td className={styles.cell}>2. Cuti Besar <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti Besar')}</span></td>
                                </tr>
                                 <tr>
                                    <td className={styles.cell}>3. Cuti Sakit <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti Sakit')}</span></td>
                                    <td className={styles.cell}>4. Cuti Melahirkan <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti Melahirkan')}</span></td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>5. Cuti Karena Alasan Penting <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti Alasan Penting')}</span></td>
                                    <td className={styles.cell}>6. Cuti di Luar Tanggungan Negara <span className="float-right font-bold text-lg">{leaveTypeCheck('Cuti di Luar Tanggungan Negara')}</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* SECTION III */}
                    <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">III. ALASAN CUTI</p>
                        <div className={`${styles.cell} min-h-[2rem]`}>{request.reason}</div>
                    </section>

                    {/* SECTION IV */}
                     <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">IV. LAMANYA CUTI</p>
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
                    </section>
                    
                    {/* SECTION V */}
                    <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">V. CATATAN CUTI ***</p>
                         <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cell} colSpan={3}>1. CUTI TAHUNAN</td>
                                    <td className={styles.cell} rowSpan={2} className="align-top">PARAF PETUGAS CUTI</td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>Tahun</td>
                                    <td className={styles.cell}>Sisa</td>
                                    <td className={styles.cell}>Keterangan</td>
                                </tr>
                                <tr>
                                    <td className={styles.cell}>{currentYear}</td>
                                    <td className={styles.cell}>{user.annualLeaveBalance}</td>
                                    <td className={styles.cell}></td>
                                    <td className={styles.cell}><div className="h-6"></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    
                    {/* SECTION VI */}
                    <section className={`${styles.sectionContainer} mt-2`}>
                      <div className="flex">
                        <div className="w-2/3">
                          <p className="font-bold">VI. ALAMAT SELAMA MENJALANKAN CUTI</p>
                          <table className={styles.table}>
                            <tbody>
                              <tr>
                                <td className={`${styles.cell} h-[140px] align-top`}>..................................</td>
                                <td className={styles.cell}>TELP: ....................</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="w-1/3 text-center">
                          <SignatureBlock user={user} signatureDate={request.createdAt} title="Hormat saya,"/>
                        </div>
                      </div>
                    </section>
                    
                    {/* SECTION VII */}
                    <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">VII. PERTIMBANGAN ATASAN LANGSUNG</p>
                        <div className="flex">
                             {allApprovers.map((approverItem, index) => (
                                <div key={index} className="w-1/3 text-center">
                                    <SignatureBlock user={approverItem} signatureDate={new Date()} />
                                </div>
                            ))}
                             {/* Placeholders for up to 3 approvers */}
                            {[...Array(3 - allApprovers.length)].map((_, i) => (
                               <div key={`placeholder-${i}`} className="w-1/3 p-2">
                                  <div className="h-full border border-dashed"></div>
                               </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION VIII */}
                    <section className={`${styles.sectionContainer} mt-2`}>
                        <p className="font-bold">VIII. KEPUTUSAN PEJABAT YANG BERWENANG MEMBERIKAN CUTI **</p>
                         <table className={styles.table}>
                            <tbody>
                                <tr>
                                    <td className={styles.cellCenter}>DISETUJUI</td>
                                    <td className={styles.cellCenter}>PERUBAHAN****</td>
                                    <td className={styles.cellCenter}>DITANGGUHKAN****</td>
                                    <td className={styles.cellCenter}>TIDAK DISETUJUI****</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={`${styles.cell} p-1`}>
                                         <div className="flex justify-end">
                                             <div className="w-2/3">
                                                 {/* Empty space for comments */}
                                                 <div className="h-24"></div>
                                             </div>
                                            <div className="w-1/3 text-center">
                                                <SignatureBlock user={headOfAgency} signatureDate={new Date()} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>

                <footer className="mt-2 text-xs">
                    <p className="font-bold">Catatan:</p>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="align-top w-10">*</td>
                                <td>Coret yang tidak perlu</td>
                            </tr>
                             <tr>
                                <td className="align-top">**</td>
                                <td>Pilih salah satu dengan memberi tanda centang (V)</td>
                            </tr>
                            <tr>
                                <td className="align-top">***</td>
                                <td>Diisi oleh pejabat yang menangani bidang kepegawaian sebelum PNS mengajukan cuti</td>
                            </tr>
                             <tr>
                                <td className="align-top">****</td>
                                <td>Diberi tanda centang dan alasan</td>
                            </tr>
                        </tbody>
                    </table>
                </footer>
            </div>
        </div>
    );
}

    