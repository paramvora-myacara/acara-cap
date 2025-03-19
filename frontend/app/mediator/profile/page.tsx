"use client"

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
import {
  ArrowLeft,
  BadgeCheck,
  Building,
  Camera,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  Phone,
  Save,
  User,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Define the form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  title: z.string().min(2, { message: "Job title must be at least 2 characters." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
  yearsExperience: z.string().min(1, { message: "Please select years of experience." }),
  specialties: z.string().min(2, { message: "Please enter your specialties." }),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  publicProfile: z.boolean().default(true),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Mock mediator data
const mockMediatorData = {
  id: 5,
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@realestate.com",
  phone: "(555) 123-4567",
  company: "Capital Connections",
  title: "Senior Mediator",
  bio: "Experienced real estate finance professional with over 10 years in commercial real estate lending and capital markets. Specialized in connecting borrowers with the right lenders for their projects.",
  yearsExperience: "10+",
  specialties: "Commercial Real Estate, Multifamily, Retail, Office",
  profileImage: "/placeholder.svg?height=200&width=200",
  emailNotifications: true,
  smsNotifications: true,
  publicProfile: true,
  stats: {
    activeProjects: 12,
    completedDeals: 87,
    successRate: 92,
    averageResponseTime: "4 hours",
    totalFundingFacilitated: 245000000, // $245M
  },
}

export default function MediatorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  // Initialize form with mock data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: mockMediatorData.firstName,
      lastName: mockMediatorData.lastName,
      email: mockMediatorData.email,
      phone: mockMediatorData.phone,
      company: mockMediatorData.company,
      title: mockMediatorData.title,
      bio: mockMediatorData.bio,
      yearsExperience: mockMediatorData.yearsExperience,
      specialties: mockMediatorData.specialties,
      emailNotifications: mockMediatorData.emailNotifications,
      smsNotifications: mockMediatorData.smsNotifications,
      publicProfile: mockMediatorData.publicProfile,
    },
  })

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setLoading(true)
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingImage(true)
      // In a real app, this would upload the image to a storage service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile image updated",
        description: "Your profile image has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/mediator">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        </div>
        <p className="text-slate-600">Manage your personal and professional information</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Your profile photo will be visible to borrowers and lenders</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={mockMediatorData.profileImage} alt="Profile" />
                      <AvatarFallback className="text-2xl">
                        {mockMediatorData.firstName.charAt(0)}
                        {mockMediatorData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <div className="rounded-full bg-primary p-2 text-white shadow-sm">
                          <Camera className="h-4 w-4" />
                        </div>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">
                      {mockMediatorData.firstName} {mockMediatorData.lastName}
                    </h3>
                    <p className="text-muted-foreground">{mockMediatorData.title}</p>
                    <p className="text-muted-foreground text-sm">{mockMediatorData.company}</p>
                  </div>

                  <div className="w-full mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockMediatorData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mockMediatorData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{mockMediatorData.company}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal and professional details</CardDescription>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing || loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing || loading} />
                                </FormControl>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing || loading} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
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
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Bio</FormLabel>
                              <FormControl>
                                <Textarea {...field} disabled={!isEditing || loading} className="min-h-[120px]" />
                              </FormControl>
                              <FormDescription>
                                Briefly describe your experience and expertise (max 500 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="yearsExperience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <Select
                                  disabled={!isEditing || loading}
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select years of experience" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1-3">1-3 years</SelectItem>
                                    <SelectItem value="4-6">4-6 years</SelectItem>
                                    <SelectItem value="7-9">7-9 years</SelectItem>
                                    <SelectItem value="10+">10+ years</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="specialties"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specialties</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={!isEditing || loading}
                                    placeholder="e.g., Commercial, Multifamily, Retail"
                                  />
                                </FormControl>
                                <FormDescription>Separate specialties with commas</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
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
                                <FormDescription>Make your profile visible to borrowers and lenders</FormDescription>
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

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your performance statistics as a mediator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Active Projects"
                  value={mockMediatorData.stats.activeProjects.toString()}
                  icon={<Clock className="h-5 w-5" />}
                  description="Current projects in progress"
                />
                <MetricCard
                  title="Completed Deals"
                  value={mockMediatorData.stats.completedDeals.toString()}
                  icon={<CheckCircle className="h-5 w-5" />}
                  description="Successfully closed deals"
                />
                <MetricCard
                  title="Success Rate"
                  value={`${mockMediatorData.stats.successRate}%`}
                  icon={<BadgeCheck className="h-5 w-5" />}
                  description="Percentage of successful matches"
                />
                <MetricCard
                  title="Total Funding"
                  value={`$${(mockMediatorData.stats.totalFundingFacilitated / 1000000).toFixed(1)}M`}
                  icon={<Building className="h-5 w-5" />}
                  description="Total funding facilitated"
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <ActivityItem
                    title="New Match Created"
                    description="You matched Smith Real Estate with Capital Funding Group"
                    date="2 days ago"
                  />
                  <ActivityItem
                    title="Deal Closed"
                    description="The Oakwood Apartments project was successfully funded"
                    date="1 week ago"
                  />
                  <ActivityItem
                    title="New Project Added"
                    description="You were assigned to the Downtown Office Complex project"
                    date="2 weeks ago"
                  />
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

