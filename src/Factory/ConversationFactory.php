<?php 

namespace App\Factory;

use App\Entity\Conversation;
use App\Repository\ConversationRepository;
use App\Entity\User;

class ConversationFactory
{
    public function __construct(
        private readonly ConversationRepository $conversationRepository
    ){
    }

    public function create(User $sender, User $recipient): Conversation
    {
        $conversation = new Conversation();

        $conversation->addUser($sender);
        $conversation->addUser($recipient);

        $this->conversationRepository->save($conversation);

        return $conversation;
    }
}