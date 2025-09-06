import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { StarRating } from "./star-rating";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Review, type User } from "@shared/schema";

interface ReviewWithUser extends Review {
  user: Pick<User, 'id' | 'firstName' | 'lastName'>;
}

interface ReviewsListProps {
  reviews: ReviewWithUser[];
  isLoading?: boolean;
}

export function ReviewsList({ reviews, isLoading }: ReviewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="reviews-list">
      {reviews.map((review) => (
        <Card key={review.id} data-testid={`review-${review.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-sm">
                  {(review.user.firstName?.[0] || '') + (review.user.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm" data-testid={`reviewer-name-${review.id}`}>
                      {review.user.firstName || ''} {review.user.lastName || ''}
                    </h4>
                    {review.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Đã mua hàng
                      </Badge>
                    )}
                  </div>
                  <time 
                    className="text-xs text-muted-foreground"
                    data-testid={`review-date-${review.id}`}
                  >
                    {formatDistanceToNow(new Date(review.createdAt), { 
                      addSuffix: true,
                      locale: vi 
                    })}
                  </time>
                </div>
                
                <StarRating 
                  rating={review.rating} 
                  size="sm" 
                  showValue={true}
                  data-testid={`review-rating-${review.id}`}
                />
                
                {review.comment && (
                  <p 
                    className="text-sm text-muted-foreground leading-relaxed"
                    data-testid={`review-comment-${review.id}`}
                  >
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}