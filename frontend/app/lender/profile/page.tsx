"use client"

import { Progress } from "@/components/ui/progress"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BadgeCheck,
  Building,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Define the form schema
const profileFormSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  contactName: z.string().min(2, { message: "Contact name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  description: z.string().max(500, { message: "Description must not exceed 500 characters." }).optional(),
  yearsInBusiness: z.string().min(1, { message: "Please select years in business." }),
  lenderType: z.string().min(1, { message: "Please select lender type." }),
  assetTypes: z.string().min(2, { message: "Please enter asset types you fund." }),
  minLoanSize: z.string().min(1, { message: "Please enter minimum loan size." }),
  maxLoanSize: z.string().min(1, { message: "Please enter maximum loan size." }),
  typicalLTV: z.string().min(1, { message: "Please enter typical LTV range." }),
  geographicFocus: z.string().min(2, { message: "Please enter geographic focus." }),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  publicProfile: z.boolean().default(true),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Mock lender data
const mockLenderData = {
  id: 2,
  companyName: "Capital Funding Group",
  contactName: "Michael Roberts",
  email: "m.roberts@capitalfunding.com",
  phone: "(555) 987-6543",
  address: "123 Finance St, New York, NY 10001",
  website: "https://www.capitalfunding.com",
  description:
    "Capital Funding Group is a leading commercial real estate lender specializing in multifamily, retail, and office properties. We offer competitive rates and flexible terms for projects across the United States.",
  yearsInBusiness: "15+",
  lenderType: "Bank",
  assetTypes: "Multifamily, Retail, Office, Industrial",
  minLoanSize: "1000000", // $1M
  maxLoanSize: "50000000", // $50M
  typicalLTV: "75",
  geographicFocus: "Northeast, Mid-Atlantic, Southeast",
  companyLogo: "/placeholder.svg?height=200&width=200",
  emailNotifications: true,
  smsNotifications: true,
  publicProfile: true,
  stats: {
    activeDeals: 8,
    fundedProjects: 124,
    totalFunding: 750000000, // $750M
    averageDealSize: 6000000, // $6M
    conversionRate: 32, // 32%
  },
}

export default function LenderProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const { toast } = useToast()

  // Initialize form with mock data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: mockLenderData.companyName,
      contactName: mockLenderData.contactName,
      email: mockLenderData.email,
      phone: mockLenderData.phone,
      address: mockLenderData.address,
      website: mockLenderData.website,
      description: mockLenderData.description,
      yearsInBusiness: mockLenderData.yearsInBusiness,
      lenderType: mockLenderData.lenderType,
      assetTypes: mockLenderData.assetTypes,
      minLoanSize: mockLenderData.minLoanSize,
      maxLoanSize: mockLenderData.maxLoanSize,
      typicalLTV: mockLenderData.typicalLTV,
      geographicFocus: mockLenderData.geographicFocus,
      emailNotifications: mockLenderData.emailNotifications,
      smsNotifications: mockLenderData.smsNotifications,
      publicProfile: mockLenderData.publicProfile,
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true)
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your company profile has been updated successfully.",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingLogo(true)
      // In a real app, this would upload the image to a storage service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Company logo updated",
        description: "Your company logo has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company logo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingLogo(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/lender">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">Company Profile</h1>
        </div>
        <p className="text-slate-600">Manage your company information and lending preferences</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="lending" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Lending Criteria
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Company Logo</CardTitle>
                  <CardDescription>Your company logo will be visible to borrowers</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={mockLenderData.companyLogo} alt="Company Logo" />
                      <AvatarFallback className="text-2xl">{mockLenderData.companyName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="company-logo" className="cursor-pointer">
                        <div className="rounded-full bg-primary p-2 text-white shadow-sm">
                          <Camera className="h-4 w-4" />
                        </div>
                        <input
                          id="company-logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{mockLenderData.companyName}</h3>
                    <p className="text-muted-foreground">{mockLenderData.lenderType}</p>
                  </div>

                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{mockLenderData.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockLenderData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mockLenderData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{mockLenderData.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Update your company details and contact information</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={loading}
                  >
                    {isEditing ? (
                      <>Cancel</>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing || loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Contact Name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing || loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lenderType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lender Type</FormLabel>
                                <Select
                                  disabled={!isEditing || loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select lender type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Bank">Bank</SelectItem>
                                    <SelectItem value="Credit Union">Credit Union</SelectItem>
                                    <SelectItem value="Private Equity">Private Equity</SelectItem>
                                    <SelectItem value="Debt Fund">Debt Fund</SelectItem>
                                    <SelectItem value="CMBS">CMBS</SelectItem>
                                    <SelectItem value="Insurance Company">Insurance Company</SelectItem>
                                    <SelectItem value="Family Office">Family Office</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" disabled={!isEditing || loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing || loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing || loading} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing || loading}
                                  placeholder="https://www.example.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Description</FormLabel>
                              <FormControl>
                                <Textarea {...field} disabled={!isEditing || loading} className="min-h-[120px]" />
                              </FormControl>
                              <FormDescription>
                                Briefly describe your company and lending focus (max 500 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearsInBusiness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years in Business</FormLabel>
                              <Select
                                disabled={!isEditing || loading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select years in business" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="<1">Less than 1 year</SelectItem>
                                  <SelectItem value="1-5">1-5 years</SelectItem>
                                  <SelectItem value="6-10">6-10 years</SelectItem>
                                  <SelectItem value="11-15">11-15 years</SelectItem>
                                  <SelectItem value="15+">15+ years</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>

                        <FormField
                          control={form.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Email Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications about new matches and messages via email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || loading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="smsNotifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">SMS Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications about new matches and messages via SMS
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || loading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publicProfile"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Public Profile</FormLabel>
                                <FormDescription>Make your company profile visible to borrowers</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isEditing || loading}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {isEditing && (
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? (
                            <>Saving Changes...</>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lending">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lending Criteria</CardTitle>
                <CardDescription>Define your lending preferences to improve match quality</CardDescription>
              </div>
              <Button
                variant={isEditing ? "ghost" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Criteria
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="assetTypes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset Types</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing || loading}
                              placeholder="e.g., Multifamily, Retail, Office, Industrial"
                            />
                          </FormControl>
                          <FormDescription>Separate asset types with commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minLoanSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Loan Size ($)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing || loading} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxLoanSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Loan Size ($)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing || loading} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="typicalLTV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Typical Loan-to-Value (LTV) %</FormLabel>
                          <FormControl>
                            <div className="pt-2">
                              <Slider
                                disabled={!isEditing || loading}
                                defaultValue={[Number.parseInt(field.value)]}
                                max={100}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0].toString())}
                              />
                              <div className="flex justify-between mt-2">
                                <span className="text-sm text-muted-foreground">0%</span>
                                <span className="text-sm font-medium">{field.value}%</span>
                                <span className="text-sm text-muted-foreground">100%</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="geographicFocus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geographic Focus</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing || loading}
                              placeholder="e.g., Northeast, West Coast, National"
                            />
                          </FormControl>
                          <FormDescription>Separate regions with commas</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <h3 className="text-base font-medium mb-2">Deal Types</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Acquisition
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Refinance
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Construction
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Bridge
                        </Badge>
                        <Badge variant="outline">Value-Add</Badge>
                        <Badge variant="outline">Permanent</Badge>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="h-6">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-base font-medium mb-2">Capital Types</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Senior Debt
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Mezzanine
                        </Badge>
                        <Badge variant="outline">Preferred Equity</Badge>
                        <Badge variant="outline">Common Equity</Badge>
                        {isEditing && (
                          <Button variant="outline" size="sm" className="h-6">
                            + Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>Saving Changes...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Lending Criteria
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Lending Activity</CardTitle>
              <CardDescription>Your lending statistics and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Active Deals"
                  value={mockLenderData.stats.activeDeals.toString()}
                  icon={<Clock className="h-5 w-5" />}
                  description="Current deals in progress"
                />
                <MetricCard
                  title="Funded Projects"
                  value={mockLenderData.stats.fundedProjects.toString()}
                  icon={<CheckCircle className="h-5 w-5" />}
                  description="Successfully funded projects"
                />
                <MetricCard
                  title="Total Funding"
                  value={`$${(mockLenderData.stats.totalFunding / 1000000).toFixed(0)}M`}
                  icon={<DollarSign className="h-5 w-5" />}
                  description="Total capital deployed"
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${mockLenderData.stats.conversionRate}%`}
                  icon={<BadgeCheck className="h-5 w-5" />}
                  description="Match to funding rate"
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <ActivityItem
                    title="New Match Received"
                    description="You were matched with Smith Real Estate for the Oakwood Apartments project"
                    date="2 days ago"
                  />
                  <ActivityItem
                    title="Deal Funded"
                    description="The Downtown Office Complex project was successfully funded"
                    date="1 week ago"
                  />
                  <ActivityItem
                    title="Match Accepted"
                    description="You accepted the match for the Riverfront Development project"
                    date="2 weeks ago"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Funding Distribution by Asset Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Multifamily</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        45%
                      </Badge>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Office</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        25%
                      </Badge>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Retail</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        20%
                      </Badge>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Industrial</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        10%
                      </Badge>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon,
  description,
}: {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ActivityItem({
  title,
  description,
  date,
}: {
  title: string
  description: string
  date: string
}) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        <Clock className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-sm text-muted-foreground">{date}</div>
    </div>
  )
}

