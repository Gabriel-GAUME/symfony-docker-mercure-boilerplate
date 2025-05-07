<?php

namespace App\Service;

use App\Entity\RefreshToken;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class TokenService
{
    public function __construct(
        private JWTTokenManagerInterface $jwtManager,
        private EntityManagerInterface $entityManager,
    ) {}

    public function generateTokens(UserInterface $user, ?string $userAgent = null): array
    {
        $accessToken = $this->jwtManager->create($user);

        $refreshToken = bin2hex(random_bytes(40));
        $expiresAt = new \DateTimeImmutable('+7 days');

        $refreshTokenEntity = (new RefreshToken())
            ->setRefreshToken($refreshToken)
            ->setExpiresAt($expiresAt)
            ->setUserId($user->getUserIdentifier())
            ->setUserAgent($userAgent)
            ->setIsValid(true);

        $this->entityManager->persist($refreshTokenEntity);
        $this->entityManager->flush();

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
        ];
    }

    public function refreshAccessToken(string $refreshToken, ?string $userAgent = null): ?array
    {
        $token = $this->entityManager
            ->getRepository(RefreshToken::class)
            ->findOneBy(['refreshToken' => $refreshToken, 'isValid' => true]);

        if (!$token || $token->getExpiresAt() < new \DateTimeImmutable()) {
            return null; // Token invalide ou expiré
        }

        // Invalider l'ancien refresh token
        $token->setIsValid(false);
        $this->entityManager->flush();

        $user = $this->entityManager->getRepository('App\Entity\User')
            ->find($token->getUserId());

        // Générer un nouveau refresh token
        return $this->generateTokens($user, $userAgent);
    }
}
