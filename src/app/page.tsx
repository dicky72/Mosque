"use client"

import { useState, useEffect } from "react"
import { Clock, Heart, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll events for navbar styling and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = ["home", "prayer-times", "about", "gallery", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionId : string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  // Prayer times data
  const prayerTimes = [
    { name: "Subuh", time: "04:45", arabicName: "الفجر" },
    { name: "Dzuhur", time: "12:15", arabicName: "الظهر" },
    { name: "Ashar", time: "15:30", arabicName: "العصر" },
    { name: "Maghrib", time: "18:10", arabicName: "المغرب" },
    { name: "Isya", time: "19:30", arabicName: "العشاء" },
  ]

  // Navigation links
  const navLinks = [
    { name: "Beranda", id: "home" },
    { name: "Jadwal Sholat", id: "prayer-times" },
    { name: "Tentang", id: "about" },
    { name: "Galeri", id: "gallery" },
    { name: "Kontak", id: "contact" },
  ]

  // Imam data
  const imams = [
    {
      id: "imam-1",
      name: "Ustadz Ahmad Fauzi",
      role: "Imam Utama",
      bio: "Ustadz Ahmad Fauzi adalah lulusan Universitas Al-Azhar Kairo dan telah menjadi imam di Masjid Jami As-Salam selama 10 tahun. Beliau ahli dalam bidang tafsir Al-Quran dan hadits.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "imam-2",
      name: "Ustadz Muhammad Ridwan",
      role: "Imam & Pengajar",
      bio: "Ustadz Muhammad Ridwan adalah hafidz Quran 30 juz dan aktif mengajar di berbagai pengajian. Beliau fokus pada pendidikan Islam untuk anak-anak dan remaja di lingkungan masjid.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "imam-3",
      name: "Ustadz Abdul Rahman",
      role: "Imam & Khatib",
      bio: "Ustadz Abdul Rahman adalah lulusan Universitas Islam Madinah dan telah menjadi khatib Jumat selama 15 tahun. Beliau juga aktif dalam kegiatan dakwah di berbagai daerah.",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop",
    },
  ]

  // DonationModal component
  const DonationModal = ({ triggerButton } : {triggerButton : any}) => {
    const [step, setStep] = useState(1)
    const [donationAmount, setDonationAmount] = useState("1000000")
    const [customAmount, setCustomAmount] = useState("")
    const [donorName, setDonorName] = useState("")
    const [donorEmail, setDonorEmail] = useState("")
    const [donorPhone, setDonorPhone] = useState("")
    const [donorMessage, setDonorMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [transactionId, setTransactionId] = useState("")

    // Format currency to Indonesian Rupiah
    const formatCurrency = (amount:number) => {
      return new Intl.NumberFormat("id-ID").format(amount)
    }

    // Handle donation submission
    const handleDonationSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault()

      // Validate form
      const newErrors: Record<string, string> = {};
if (!donorName) newErrors.name = "Nama wajib diisi";
if (!donorPhone) newErrors.phone = "Nomor telepon wajib diisi";

if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
}


      setIsSubmitting(true)

      // Generate transaction ID
      const generatedId = `DON-${Date.now().toString().substring(5)}`
      setTransactionId(generatedId)

      try {
        // Prepare data for webhook
        const donationData = {
          transactionId: generatedId,
          amount: donationAmount === "custom" ? Number.parseInt(customAmount) : Number.parseInt(donationAmount),
          amountFormatted: `Rp ${formatCurrency(Number.parseInt(donationAmount === "custom" ? customAmount : donationAmount))}`,
          name: donorName,
          email: donorEmail || "tidak diisi",
          phone: donorPhone,
          message: donorMessage || "tidak ada pesan",
          timestamp: new Date().toISOString(),
          source: "website_masjid",
        }

        console.log("Mengirim data donasi:", donationData)

        // Send data to webhook
        const response = await fetch("https://hook.us2.make.com/r6uz1aajlsb5szox277edn0p8yxo5u8z", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donationData),
        })

        if (!response.ok) {
          console.error("Error response:", await response.text())
          throw new Error(`Gagal mengirim data donasi: ${response.status}`)
        }

        // Proceed to success step
        setStep(3)
      } catch (error) {
        console.error("Error submitting donation:", error)
        alert("Terjadi kesalahan saat mengirim donasi. Silakan coba lagi.")
      } finally {
        setIsSubmitting(false)
      }
    }

    // Reset form when dialog closes
    const handleDialogClose = () => {
      setTimeout(() => {
        setStep(1)
        setErrors({})
        setCustomAmount("")
        setDonorName("")
        setDonorEmail("")
        setDonorPhone("")
        setDonorMessage("")
      }, 300)
    }

    return (
      <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent
          className="sm:max-w-[550px] p-0 overflow-hidden bg-white border border-gray-200"
          style={{ backgroundColor: "white" }}
        >
          {step === 1 && (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">Dukung Masjid Jami As-Salam</DialogTitle>
                <DialogDescription>
                  Donasi Anda membantu kami memelihara masjid dan mendukung program-program komunitas kami.
                </DialogDescription>
              </DialogHeader>
              <DialogHeader />
<div className="px-4 py-3 sm:px-6 sm:py-4">
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="donation-amount" className="text-sm font-medium">
        Pilih Jumlah Donasi
      </Label>
      
      {/* Grid Pilihan Donasi */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Button
          type="button"
          variant={donationAmount === "500000" ? "default" : "outline"}
          onClick={() => {
            setDonationAmount("500000")
            setCustomAmount("")
          }}
          className="text-center h-14 md:h-16 flex flex-col text-sm md:text-base"
        >
          <span className="font-bold">Rp 500.000</span>
        </Button>
        <Button
          type="button"
          variant={donationAmount === "1000000" ? "default" : "outline"}
          onClick={() => {
            setDonationAmount("1000000")
            setCustomAmount("")
          }}
          className="text-center h-14 md:h-16 flex flex-col text-sm md:text-base"
        >
          <span className="font-bold">Rp 1.000.000</span>
        </Button>
      </div>

      {/* Input Custom Amount */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm md:text-base">
          Rp
        </span>
        <Input
          id="donation-amount"
          className="pl-8 text-sm md:text-base h-10 md:h-12"
          placeholder="Jumlah lainnya"
          value={customAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "")
            setCustomAmount(value)
            setDonationAmount(value ? "custom" : "1000000")
          }}
        />
      </div>
    </div>
  </div>
</div>

{/* Footer dengan Tombol Lanjutkan */}
<DialogFooter className="px-4 py-3 sm:px-6 sm:py-4 bg-muted/30">
  <Button onClick={() => setStep(2)} className="w-full h-12 md:h-14 text-sm md:text-base">
    Lanjutkan
  </Button>
</DialogFooter>


            </>
          )}

          {step === 2 && (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">Informasi Donatur</DialogTitle>
                <DialogDescription>Mohon lengkapi informasi Anda untuk melanjutkan donasi</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleDonationSubmit} className="max-h-[75vh] sm:max-h-none overflow-y-auto">
  <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
    
    {/* Nama Lengkap */}
    <div className="space-y-1">
      <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
        Nama Lengkap <span className="text-destructive">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Masukkan nama Anda"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        className={`h-10 sm:h-12 ${errors.name ? "border-destructive" : ""}`}
      />
      {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
    </div>

    {/* Email */}
    <div className="space-y-1">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Masukkan email Anda"
        value={donorEmail}
        onChange={(e) => setDonorEmail(e.target.value)}
        className="h-10 sm:h-12"
      />
    </div>

    {/* Nomor Telepon */}
    <div className="space-y-1">
      <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
        Nomor Telepon <span className="text-destructive">*</span>
      </Label>
      <Input
        id="phone"
        placeholder="Masukkan nomor telepon Anda"
        value={donorPhone}
        onChange={(e) => setDonorPhone(e.target.value)}
        className={`h-10 sm:h-12 ${errors.phone ? "border-destructive" : ""}`}
      />
      {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
    </div>

    {/* Pesan (Opsional) */}
    <div className="space-y-1">
      <Label htmlFor="message">Pesan (Opsional)</Label>
      <textarea
        id="message"
        className="min-h-[60px] sm:min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2"
        placeholder="Tulis pesan Anda di sini"
        value={donorMessage}
        onChange={(e) => setDonorMessage(e.target.value)}
      />
    </div>

    {/* Ringkasan Donasi */}
    <div className="bg-muted/30 p-3 sm:p-4 rounded-lg border border-muted text-sm sm:text-base">
      <h3 className="font-medium mb-1 sm:mb-2">Ringkasan Donasi</h3>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Jumlah Donasi</span>
        <span className="font-medium">
          Rp{" "}
          {donationAmount === "custom"
            ? formatCurrency(Number(customAmount) || 0)
            : formatCurrency(Number(donationAmount) || 0)}
        </span>
      </div>
    </div>
  </div>

  {/* Footer Sticky agar tombol selalu terlihat */}
  <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-muted p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
    <Button
      type="button"
      variant="outline"
      onClick={() => setStep(1)}
      className="w-full sm:w-1/3 h-10 sm:h-12 text-sm sm:text-base"
    >
      Kembali
    </Button>
    <Button
      type="submit"
      className="w-full sm:w-2/3 h-10 sm:h-12 text-sm sm:text-base"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Memproses...
        </>
      ) : (
        "Lanjutkan ke Pembayaran"
      )}
    </Button>
  </div>
</form>


            </>
          )}

          {step === 3 && (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl">Informasi Pembayaran</DialogTitle>
                <DialogDescription>Silakan transfer donasi Anda ke rekening berikut</DialogDescription>
              </DialogHeader>
              <div className="px-4 sm:px-6 py-3 sm:py-4">
  <div className="bg-muted/30 p-4 sm:p-5 rounded-lg border border-muted mb-4 sm:mb-6 max-w-lg mx-auto">
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center text-sm sm:text-base">
        <span className="text-muted-foreground">Bank</span>
        <span className="font-medium">Bank Syariah Indonesia</span>
      </div>
      <div className="flex justify-between items-center text-sm sm:text-base">
        <span className="text-muted-foreground">Nomor Rekening</span>
        <div className="flex items-center gap-2">
          <span className="font-medium select-all">7890 1234 5678 90</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6"
            onClick={() => navigator.clipboard.writeText("7890123456789")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-copy"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm sm:text-base">
        <span className="text-muted-foreground">Atas Nama</span>
        <span className="font-medium">Yayasan Masjid Jami As-Salam</span>
      </div>
      <div className="flex justify-between items-center text-sm sm:text-lg">
        <span className="text-muted-foreground">Jumlah Transfer</span>
        <span className="font-bold text-primary">
          Rp{" "}
          {donationAmount === "custom"
            ? formatCurrency(Number(customAmount) || 0)
            : formatCurrency(Number(donationAmount) || 0)}
        </span>
      </div>
    </div>
  </div>

  <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 py-3 sm:py-4 max-w-lg mx-auto">
    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/20 flex items-center justify-center">
      <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
    </div>
    <h3 className="text-lg sm:text-xl font-medium">Terima Kasih!</h3>
    <p className="text-center text-sm sm:text-base text-muted-foreground">
      Donasi Anda telah berhasil dicatat. Silakan transfer sesuai jumlah yang tertera dan simpan bukti transfer Anda.
    </p>
    <div className="bg-primary/10 p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-center w-full max-w-md">
      <p className="font-medium text-primary">ID Transaksi: {transactionId}</p>
      <p className="text-muted-foreground mt-1">
        Harap sertakan ID Transaksi ini pada keterangan transfer Anda
      </p>
    </div>
  </div>
</div>

<DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 bg-muted/30">
  <Button onClick={() => handleDialogClose()} className="w-full max-w-md mx-auto">
    Selesai
  </Button>
</DialogFooter>


            </>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-white border-b border-gray-200" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-xs md:text-sm">JAS</span>
            </div>
            <span className="font-semibold text-base md:text-xl">Masjid Jami As-Salam</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === link.id ? "text-primary" : ""
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <DonationModal triggerButton={<Button className="hidden md:inline-flex">Donasi</Button>} />

           {/* Mobile Navigation */}
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent
    side="right"
    className="w-[300px] sm:w-[400px] bg-white border-l border-gray-200 p-6 flex flex-col"
  >
    {/* Header Mobile Navigation */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-xs">
            JAS
          </span>
        </div>
        <span className="font-semibold text-lg">Masjid Jami As-Salam</span>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex flex-col gap-4">
      {navLinks.map((link) => (
        <button
          key={link.id}
          onClick={() => {
            scrollToSection(link.id);
            const element = document.querySelector('[data-state="open"]');
            if (element instanceof HTMLElement) {
              element.click();
            }
          }}
          className={`flex items-center py-2 text-lg font-medium transition-colors hover:text-primary ${
            activeSection === link.id ? "text-primary font-semibold" : "text-gray-700"
          }`}
        >
          {link.name}
        </button>
      ))}
    </nav>

    {/* Tombol Donasi */}
    <div className="mt-auto pt-6">
      <DonationModal triggerButton={<Button className="w-full">Donasi</Button>} />
    </div>
  </SheetContent>
</Sheet>

          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="home" className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23166534' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.3,
            }}
          />
          <div className="container relative flex flex-col items-center justify-center space-y-6 py-32 text-center md:py-48">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Masjid Jami As-Salam
            </h1>
            <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed dark:text-gray-300">
              Tempat kedamaian, ibadah, dan komunitas bagi seluruh umat Islam
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="rounded-full px-8" onClick={() => scrollToSection("contact")}>
                Kunjungi Kami
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => scrollToSection("about")}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Prayer Times Section */}
        <section id="prayer-times" className="py-24 bg-muted/50 relative overflow-hidden">
          <div className="container relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                Jadwal Harian
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Jadwal Sholat</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Bergabunglah dengan kami untuk sholat berjamaah di Masjid Jami As-Salam
              </p>
            </div>

            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {prayerTimes.map((prayer) => (
                  <Card
                    key={prayer.name}
                    className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all"
                  >
                    <CardContent className="p-0">
                      <div className="bg-primary p-3 text-center text-primary-foreground">
                        <h3 className="font-semibold text-base lg:text-lg">{prayer.name}</h3>
                        <p className="text-primary-foreground/80 text-xs lg:text-sm">{prayer.arabicName}</p>
                      </div>
                      <div className="flex items-center justify-center p-4 lg:p-6 bg-gradient-to-b from-white to-muted/30">
                        <Clock className="mr-2 h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                        <span className="font-medium text-base lg:text-lg">{prayer.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center rounded-xl border bg-card p-6 text-card-foreground shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-primary font-semibold">Sholat Jumat Hari Ini</div>
                  <div className="flex items-center text-2xl font-bold">
                    <Clock className="mr-2 h-6 w-6 text-primary" />
                    <span>12:30</span>
                  </div>
                  <p className="mt-2 text-muted-foreground">Khutbah dimulai pukul 12:00</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 relative overflow-hidden">
          <div className="container relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                Tentang Kami
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Masjid Jami As-Salam</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Masjid kami berdedikasi untuk melayani komunitas Muslim dengan berbagai program dan kegiatan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold pt-4 text-center sm:text-left">Sejarah Kami</h3>
                <p className="text-muted-foreground">
                  Masjid Jami As-Salam didirikan pada tahun 1995 oleh sekelompok Muslim yang berdedikasi untuk
                  menciptakan tempat ibadah dan pusat komunitas bagi umat Islam di daerah ini. Selama bertahun-tahun,
                  masjid kami telah berkembang menjadi pusat kegiatan keagamaan dan sosial yang penting.
                </p>
                <p className="text-muted-foreground">
                  Kami menawarkan berbagai layanan termasuk sholat lima waktu, sholat Jumat, kelas Quran, program
                  pendidikan Islam untuk anak-anak dan dewasa, serta berbagai kegiatan sosial dan amal.
                </p>
                <h3 className="text-2xl font-bold pt-4 text-center sm:text-left">
  Visi & Misi
</h3>

                <p className="text-muted-foreground">
                  Visi kami adalah menjadi pusat keunggulan Islam yang melayani kebutuhan spiritual, pendidikan, dan
                  sosial komunitas Muslim. Misi kami adalah menyediakan lingkungan yang ramah dan inklusif di mana
                  Muslim dari segala usia dan latar belakang dapat berkumpul untuk beribadah, belajar, dan tumbuh dalam
                  iman mereka.
                </p>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000&auto=format&fit=crop')",
                  }}
                />
              </div>
            </div>

            {/* Imam Section */}
            <div className="mt-24">
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                  Para Imam Kami
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Dipimpin oleh Ulama Terbaik</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Masjid kami diberkahi dengan imam-imam yang berpengetahuan luas dan berdedikasi
                </p>
              </div>

              <Tabs defaultValue="imam-1" className="w-full">
                <TabsList className="grid w-full grid-cols-3 p-1">
                  {imams.map((imam) => (
                    <TabsTrigger key={imam.id} value={imam.id} className="text-xs sm:text-sm lg:text-base px-1 py-2">
                      <span className="line-clamp-1 text-xs sm:text-sm">{imam.name.split(" ")[0]}</span>
                      <span className="hidden sm:inline text-xs sm:text-sm">
                        {" "}
                        {imam.name.split(" ").slice(1).join(" ")}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {imams.map((imam) => (
                  <TabsContent key={imam.id} value={imam.id} className="mt-4 lg:mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-center">
                      <div className="relative h-[250px] lg:h-[300px] rounded-xl overflow-hidden shadow-lg">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url('${imam.image}')`,
                          }}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3 lg:space-y-4">
                        <h3 className="text-xl lg:text-2xl font-bold">{imam.name}</h3>
                        <p className="text-primary font-medium">{imam.role}</p>
                        <p className="text-muted-foreground text-sm lg:text-base">{imam.bio}</p>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-muted/30">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                Galeri Kami
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Momen-momen Berharga</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Lihat beberapa momen dari kegiatan dan acara di masjid kami
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[
                "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1604480133435-25b86862d276?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
              ].map((image, index) => (
                <div
                  key={index}
                  className="relative h-[200px] sm:h-[220px] lg:h-[250px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white">
                      Lihat Gambar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="container">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                Hubungi Kami
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Kunjungi Masjid Kami</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Kami senang menyambut Anda di Masjid Jami As-Salam
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Alamat</h3>
                  <p className="text-muted-foreground">Jl. Masjid Raya No. 123, Jakarta Selatan, 12345</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Kontak</h3>
                  <p className="text-muted-foreground">Telepon: +62 21 1234 5678</p>
                  <p className="text-muted-foreground">Email: info@masjidjamias-salam.org</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Jam Operasional</h3>
                  <p className="text-muted-foreground">Senin - Minggu: 24 Jam</p>
                  <p className="text-muted-foreground">Kantor Administrasi: 09:00 - 17:00 (Senin - Jumat)</p>
                </div>
                <div className="pt-4">
                  <DonationModal
                    triggerButton={
                      <Button size="lg" className="w-full md:w-auto">
                        Donasi Sekarang
                      </Button>
                    }
                  />
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                {/* This would be a map in a real application */}
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
  <iframe
    className="absolute inset-0 w-full h-full"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d588.9510474585584!2d106.72558767104849!3d-6.772946105999751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69cd6608c2a271%3A0xce94ee8b0dcc1099!2sMasjid%20Jami%20Assalam!5e0!3m2!1sid!2sid!4v1742307596267!5m2!1sid!2sid"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>



              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/80 py-12 relative">
        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-xs">JAS</span>
                </div>
                <span className="font-semibold">Masjid Jami As-Salam</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tempat kedamaian, ibadah, dan komunitas bagi seluruh umat Islam
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Jl. Masjid Raya No. 123</li>
                <li>Jakarta Selatan, 12345</li>
                <li>+62 21 1234 5678</li>
                <li>info@masjidjamias-salam.org</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-youtube"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Masjid Jami As-Salam. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

