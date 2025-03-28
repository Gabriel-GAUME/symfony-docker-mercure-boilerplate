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


    #[Route('/conversation/users/{recipient}', name: 'conversation.show')]
    public function show(?User $recipient, Request $request): Response
    {
        $sender = $this->getUser();

        $conversation = $this->conversationRepository->findByUsers($sender, $recipient);

        if(!$conversation) {
            $conversation = $this->conversationFactory->create($sender,$recipient);
        }

        $topic = $this->topicService->getTopicUrl($conversation);

        $this->discovery->addLink($request);

        $this->authorization->setCookie($request, [$topic]);

        return $this->render('conversation/show.html.twig', [
            'conversation' => $conversation,
            'topic' => $this->topicService->getTopicUrl($conversation),
        ]);
    }
}
