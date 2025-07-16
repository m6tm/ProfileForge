import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Erreur d'authentification
          </CardTitle>
          <CardDescription>
            Le lien de vérification que vous avez utilisé est invalide ou a expiré. Veuillez réessayer de vous connecter.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Retour à la page de connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
