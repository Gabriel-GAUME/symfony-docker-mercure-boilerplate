<?php

namespace App\Controller;

use App\Repository\ConversationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Factory\ConversationFactory;
use App\Service\TopicService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mercure\Authorization;
use Symfony\Component\Mercure\Discovery;
use Symfony\Component\HttpFoundation\JsonResponse;

final class ConversationController extends AbstractController
{

    public function __construct(
        private readonly Authorization $authorization,
        private readonly ConversationRepository $conversationRepository,
        private readonly ConversationFactory $conversationFactory,
        private readonly Discovery $discovery,
        private readonly TopicService $topicService
    ){
    }


    #[Route('/api/conversation/{recipient}', name: 'conversation.show')]
    public function show(?User $recipient, Request $request): JsonResponse
    {
        $sender = $this->getUser();

        $conversation = $this->conversationRepository->findByUsers($sender, $recipient);

        if(!$conversation) {
            $conversation = $this->conversationFactory->create($sender,$recipient);
        }

        $topic = $this->topicService->getTopicUrl($conversation);

        $this->discovery->addLink($request);

        $this->authorization->setCookie($request, [$topic]);

        return $this->json([
            'conversation' => $conversation,
            'topic' => $this->topicService->getTopicUrl($conversation),
        ], 200, [], ['groups' => 'conversation:read']);
    }

    #[Route('/api/conversations', name: 'get_all_conversatio')]
    public function getAllConversations(): JsonResponse
    {
        $user = $this->getUser();

        $conversations = $this->conversationRepository->findByUser($user);

        return $this->json($conversations, 200, [], ['groups' => 'conversation:read']);
    }
}
