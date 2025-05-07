<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

class LoginController extends AbstractController
{
    #[Route(path: '/loginla', name: 'login', methods: ['POST'])]
    public function login(Request $request): Response
    {

        $data = json_decode($request->getContent(), true);

        dd($data);
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
