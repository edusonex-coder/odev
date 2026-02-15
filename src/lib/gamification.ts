import { supabase } from "./supabase";

/**
 * Grants XP to a user by calling the RPC function in Supabase.
 * @param userId The ID of the user.
 * @param amount The amount of XP to grant.
 */
export async function grantXP(userId: string, amount: number) {
    try {
        const { error } = await supabase.rpc('add_xp', {
            user_id: userId,
            amount: amount
        });

        if (error) {
            console.error("XP Grant Error:", error);
        }
        return !error;
    } catch (err) {
        console.error("XP Grant Exception:", err);
        return false;
    }
}

export const XP_VALUES = {
    SOCRATIC_MESSAGE: 10,
    ASSIGNMENT_SUBMISSION: 100,
    PERFECT_GRADE: 250,
    STREAK_BONUS: 50
};
