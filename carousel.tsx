
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 206 40% 96%;
    --foreground: 210 40% 10%;
    --card: 0 0% 100%;
    --card-foreground: 210 40% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 40% 10%;
    --primary: 211 50% 45%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 20% 90%;
    --secondary-foreground: 211 50% 25%;
    --muted: 210 20% 92%;
    --muted-foreground: 210 15% 40%;
    --accent: 192 79% 54%;
    --accent-foreground: 210 40% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 210 20% 85%;
    --input: 210 20% 85%;
    --ring: 211 50% 45%;
    --radius: 0.75rem;
  }
  .dark {
    --background: 210 40% 10%;
    --foreground: 210 40% 98%;
    --card: 210 40% 12%;
    --card-foreground: 210 40% 98%;
    --popover: 210 40% 12%;
    --popover-foreground: 210 40% 98%;
    --primary: 211 50% 55%;
    --primary-foreground: 210 40% 10%;
    --secondary: 210 30% 20%;
    --secondary-foreground: 210 40% 98%;
    --muted: 210 30% 18%;
    --muted-foreground: 210 15% 70%;
    --accent: 192 79% 54%;
    --accent-foreground: 210 40% 10%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 210 30% 20%;
    --input: 210 30% 20%;
    --ring: 211 50% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
