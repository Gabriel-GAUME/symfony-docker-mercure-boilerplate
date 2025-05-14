<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use App\DTO\CreateMessage;
use App\Factory\MessageFactory;
use App\Repository\ConversationRepository;
use App\Service\TopicService;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

final class MessageController extends AbstractController
{
    public function __construct(
        private readonly ConversationRepository $conversationRepository,
        private readonly MessageFactory $factory,
        private readonly HubInterface $hub,
        private readonly TopicService $topicService
    )
    {
        
    }
    #[Route('/messages', name: 'message.create',methods: ['POST'])]
    public function create(#[MapRequestPayload] CreateMessage $payload): Response
    {
        $conversation = $this->conversationRepository->find($payload->conversationId);

        $message= $this->factory->create(conversation:$conversation, author: $this->getUser(), content: $payload->content);

        $data = [
            'authorId' => $message->getAuthor()->getId(),
            'content' => $message->getContent(),
        ];

        $update = new Update(
            topics: $this->topicService->getTopicUrl($conversation),
            data: json_encode($data),
            private: true
        );

        dd($update);

        $this->hub->publish($update);


        return new Response('', Response::HTTP_CREATED);
    }
}
