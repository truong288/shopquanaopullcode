import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "./star-rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return apiRequest(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cảm ơn bạn đã đánh giá sản phẩm!",
      });
      
      // Invalidate reviews cache
      queryClient.invalidateQueries({ 
        queryKey: [`/api/products/${productId}/reviews`] 
      });
      
      // Invalidate product cache to update rating
      queryClient.invalidateQueries({ 
        queryKey: [`/api/products/${productId}`] 
      });
      
      // Reset form
      form.reset();
      setRating(0);
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi đánh giá. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    if (rating === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số sao đánh giá",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      ...data,
      rating,
    });
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    form.setValue("rating", newRating);
  };

  return (
    <Card data-testid="review-form">
      <CardHeader>
        <CardTitle>Đánh Giá Sản Phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Đánh giá của bạn *</Label>
            <StarRating
              rating={rating}
              readonly={false}
              onChange={handleRatingChange}
              size="lg"
              className="justify-start"
              data-testid="review-form-rating"
            />
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
            <Textarea
              id="comment"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              {...form.register("comment")}
              data-testid="review-form-comment"
            />
          </div>

          <Button 
            type="submit" 
            disabled={createReviewMutation.isPending || rating === 0}
            data-testid="button-submit-review"
          >
            {createReviewMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Gửi Đánh Giá
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}