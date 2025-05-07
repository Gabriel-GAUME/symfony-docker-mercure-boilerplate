<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\TokenService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AuthController extends AbstractController
{
    private $tokenService;
    private $userRepository;

    // Injection des services nécessaires
    public function __construct(
        TokenService $tokenService,
        UserRepository $userRepository // Injection du UserRepository
    ) {
        $this->tokenService = $tokenService;
        $this->userRepository = $userRepository;
    }

    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();
        
        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(TokenStorageInterface $tokenStorage): JsonResponse
    {
        $tokenStorage->setToken(null);
        return $this->json(['message' => 'Déconnexion réussie']);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $userAgent = $request->headers->get('User-Agent');

        if (!$email || !$password) {
            return $this->json(['error' => 'Email and password are required'], 400);
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);
        if (!$user || !password_verify($password, $user->getPassword())) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $tokens = $this->tokenService->generateTokens($user, $userAgent);

        return $this->json($tokens);
    }
}
